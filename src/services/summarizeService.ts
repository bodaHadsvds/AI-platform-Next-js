import { SendData } from "@/types/document";
import { InferenceClient } from "@huggingface/inference";

const client = new InferenceClient(process.env.HUGGINGFACE_API_TOKEN);

// Simple delay helper
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function handleSummarizationStreaming(
  content: string,
  send: (data: SendData) => void
) {
  send({ status: "processing", step: "summarization_start" });

  const messages = [
  
    { role: "user", content: content },
  ];

  let generatedText = "";

  const stream = client.chatCompletionStream({
    model: "meta-llama/Llama-3.2-3B-Instruct",
    messages,
    max_tokens: 256,
  });

  for await (const chunk of stream) {
    const delta = chunk.choices[0].delta?.content;
    if (delta) {
      generatedText += delta;

      // Send partial update
      send({ task: "chat", done: false, 
        chunk: generatedText });
 
      // Wait a bit before the next chunk
      await delay(150); // adjust milliseconds for speed
    }

    if (chunk.choices[0].finish_reason) {
      // Stream finished
      send({ task: "chat", done: true, chunk: generatedText });
       
    }
  }
}
