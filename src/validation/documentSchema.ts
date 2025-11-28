import { z } from "zod";

export const documentSchema = z.object({
  content: z
    .string()
    .min(1, "Please enter text to analyze.")
    .max(5000, "Text exceeds 5,000 character limit."),
  task: z.enum(["summarization", "sentiment", "ner","chat"]),
});
