import { queueRequest } from "@/helpers/queueHelper";
import { createStream } from "@/helpers/streamHelper";
import { executeWithTimeoutAndRetry } from "@/helpers/timeoutRetryHelper";
import { handleNER, handleSentiment, handleSummarization } from "@/services/huggingFaceService";
import { SendData } from "@/types/document";
import { NextRequest } from "next/server";

export const runtime = "edge";

interface CustomError {
  message?: string;
  httpResponse?: { status?: number };
}

function handleError(error: any): Response {
  const err = error as CustomError;
  const status = err.httpResponse?.status || 500;

  switch (status) {
    case 401: return new Response(JSON.stringify({ status: "error", message: "Not authorized" }), { status: 401 });
    case 429: return new Response(JSON.stringify({ status: "error", message: "Rate limit exceeded. Try again later." }), { status: 429 });
    case 503: return new Response(JSON.stringify({ status: "error", message: "Model warming up. Please retry in 20 seconds." }), { status: 503 });
    default: return new Response(JSON.stringify({ status: "error", message: error?.message || "Unknown server error." }), { status });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { content, task } = await req.json();
    if (!content) return new Response("Missing content", { status: 400 });
    if (!task) return new Response("Missing task type", { status: 400 });

    return queueRequest(async () => {
  const { stream, send, close } = createStream<SendData>();

      (async () => {
        try {
          switch (task) {
            case "summarization":
              await executeWithTimeoutAndRetry(() => handleSummarization(content, send), 30000, 2);
              break;
            case "sentiment":
              await executeWithTimeoutAndRetry(() => handleSentiment(content, send), 30000, 2);
              break;
            case "ner":
              await executeWithTimeoutAndRetry(() => handleNER(content, send), 30000, 2);
              break;
            default:
              send({ status: "error", message: "Invalid task type" });
          }

          send({ status: "completed" });
        } catch (error:any) {
          console.error("Task error:", error);
          send({ status: "error", message: error?.message || "Task failed." });
        } finally {
          send("[DONE]");
          close();
        }
      })();

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          Connection: "keep-alive",
        },
      });
    });
  } catch (error) {
    console.error("Global error:", error);
    return handleError(error);
  }
}
