export interface DocumentItem {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  status: "idle" | "processing" | "completed" | "error";
  summary?: string;
  sentiment?: { label: string; score: number };
  entities?: { type: string; value: string }[];
  errorMessage?: string;
}

export interface DocumentProps {
  document: DocumentItem;
  onUpdateTitle: (id: string, newTitle: string) => void;
  onDelete: (id: string) => void;
   handleReanalyze: (id: string ,task:"summarization" | "sentiment" | "ner") => void; 
}
export interface StatusBadgeProps {
  status: 'idle' | 'processing' | 'completed' | 'error';
}
export type EntityType = "PERSON" | "ORG" | "LOCATION" | "DATE" | "EVENT" | "OTHER";
export interface Entity {
  type: EntityType;
  text: string;
}

export interface DocumentData {
  id: string;
  title: string;
  text: string;
  summary: string;
  confidence: number;
  sentiment: {
    label: "Positive" | "Negative" | "Neutral";
    score: number;
  };

  
  entities: Entity[];
  keywords: {
    word: string;
    relevance: number;
  }[];
}

export type SendData =
  | { status: string; step: string }
  | { task: "ner"; entity: { type: string; value: string; score: number } }
  | { task: "ner"; done: boolean; result: { type: string; value: string }[] }
  | { task: "summarization"; chunk: string }
  | { task: "summarization"; done: boolean; result: string }
  | { task: "sentiment"; done: boolean; result: { label: string; score: number } | null }|
      { status: "error", message: string } |  { status: "completed" } |         "[DONE]"; 
