type statusType ="idle" | "processing" | "completed" | "error";
export type TaskType = "summarization" | "sentiment" | "ner" |"chat";
export type EntityType = "PERSON" | "ORG" | "LOCATION" | "DATE" | "EVENT" | "OTHER";
type sentimentLabel = "Positive" | "Negative" | "Neutral";
export interface DocumentItem {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  status: statusType
  summary?: string;
  sentiment?: { label: string; score: number };
  entities?: { type: string; value: string }[];
  errorMessage?: string;
}

export interface DocumentProps {
  document: DocumentItem;
  onUpdateTitle: (id: string, newTitle: string) => void;
  onDelete: (id: string) => void;
   handleReanalyze: (id: string ,task:TaskType) => void; 
}
export interface StatusBadgeProps {
  status: statusType
}

export interface Entity {
  type: EntityType;
  value: string;
}

export interface DocumentData {
  id: string;
  title: string;
  text: string;
  summary: string;
  confidence: number;
  sentiment: {
    label: sentimentLabel
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
    | { task: "summarization"; chunk: string } |{ task: "chat"; chunk: string; done:boolean }
  | { task: "summarization"; done: boolean; result: string }
  | { task: "sentiment"; done: boolean; result: { label: string; score: number } | null }|
      { status: "error", message: string } |  { status: "completed" } |         "[DONE]"; 



interface SummarizationData {
  task: "summarization";
  chunk?: string;
  done?: boolean;
  result?: string;
  status: "processing" | "completed" | "error";
  message?: string;
}
interface ChatData {
  task: "chat";
  chunk?: string;       // partial chunk
  done?: boolean;       // final chunk indicator
  result?: string;      // optional final result
  status: "processing" | "completed" | "error";
  message?: string;
}
interface SentimentResult {
  label: "POSITIVE" | "NEGATIVE" | "NEUTRAL";
  score: number;
}

interface SentimentData {
  task: "sentiment";
  done: boolean;
  result: SentimentResult;
  status: "processing" | "completed" | "error";
  message?: string;
}



interface NerData {
  task: "ner";
  entity: Entity 
  done: boolean;
  result: Entity[];
  status: "processing" | "completed" | "error";
  message?: string;
}

interface ErrorData {
  status: "error";
  message: string;
  task: TaskType;
}

export type AnalysisData =
  | SummarizationData
  | SentimentData
  | NerData
  | ErrorData|ChatData;


