import { AnalysisData } from "@/types/document";





export async function streamAnalysis(
  content: string,
  task: string,
  onMessage: (data: AnalysisData) => void 
) {
  const res = await fetch("/api/documents/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, task }),
  });

  if (!res.body) throw new Error("No response body from SSE.");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    if(task ==="chat"){
       buffer = decoder.decode(value, { stream: true }); 
    }else{
 buffer += decoder.decode(value, { stream: true });
    }
   
    const parts = buffer.split("\n\n");
    buffer = parts.pop() || "";
    console.log('parts', parts)

    for (const part of parts) {
      if (!part.startsWith("data:")) continue;
      const jsonText = part.replace(/^data:\s*/, "");
      try {
        const json = JSON.parse(jsonText);
        onMessage(json);
      } catch {
        console.error("Invalid JSON chunk:", jsonText);
      }
    }
  }
}
