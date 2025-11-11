import { delay } from "@/helpers/delay";
import { SendData } from "@/types/document";
import { InferenceClient } from "@huggingface/inference";


const client = new InferenceClient(process.env.HUGGINGFACE_API_TOKEN);

export async function handleSummarization(content: string, send: (data: SendData) => void) {
  send({ status: "processing", step: "summarization_start" });
  const result = await client.summarization({
    model: "facebook/bart-large-cnn",
    inputs: content,
  });

  const summary = result.summary_text || "";
  for (const word of summary.split(" ")) {
    send({ task: "summarization", chunk: word });
    await delay(80);
  }

  send({ task: "summarization", done: true, result: summary });
}

export async function handleSentiment(content: string, send: (data: SendData) => void) {
  send({ status: "processing", step: "sentiment_start" });

  const result = await client.textClassification({
    model: "distilbert-base-uncased-finetuned-sst-2-english",
    inputs: content,
  });

  await delay(80);

  const sentiment = result?.[0]
    ? { label: result[0].label, score: result[0].score }
    : null;

  send({ task: "sentiment", done: true, result: sentiment });
}  

export async function handleNER(content: string,  send: (data: SendData) => void) {
  send({ status: "processing", step: "ner_start" });

  const result = await client.tokenClassification({
    model: "dslim/bert-base-NER",
    inputs: content,
  });

  for (const entity of result) {
    send({
      task: "ner",
      entity: {
    type: entity.entity_group ?? "unknown",
        value: entity.word,
        score: entity.score,
      },
    });
    await delay(80);
  }

  const entities = result.map((e) => ({
    type: e.entity_group ?? "unknown",
    value: e.word,
  }));

  send({ task: "ner", done: true, result: entities });
}
