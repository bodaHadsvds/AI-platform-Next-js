"use client";
import { useLoadingStore } from "@/hooks/useLoading";
import { TaskType } from "@/types/document";
import { useRouter } from "next/navigation";
import { useId } from "react";
import { Button } from "../ui/button";

interface DocumentActionsProps {
  documentId: string;
  selectedTask: TaskType;
  setSelectedTask: React.Dispatch<React.SetStateAction<TaskType>>;
  handleReanalyze: (id: string, task: TaskType) => void;
}

export default function DocumentActions({
  documentId,
  selectedTask,
  setSelectedTask,
  handleReanalyze,
}: DocumentActionsProps) {
  const router = useRouter();
  const uniqueId = useId();
  const startLoading = useLoadingStore((s) => s.startLoading);
  const handleNavigate = () => {
    router.push(`/document/${documentId}`);
    startLoading();
  };
  const getButtonStyle = () => {
    switch (selectedTask) {
      case "summarization":
        return "bg-blue-600 hover:bg-blue-700 text-white";
      case "sentiment":
        return "bg-green-600 hover:bg-green-700 text-white";
      case "ner":
        return "bg-orange-600 hover:bg-orange-700 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3">
      <select
        id={`${uniqueId}-task`}
        name="task"
        value={selectedTask}
        onChange={(e) =>
          setSelectedTask(
            e.target.value as "summarization" | "sentiment" | "ner"|"chat"
          )
        }
        aria-label="Choose analysis task"
        className="border rounded-md px-2 py-1 text-sm"
      >
        <option value="summarization">🧠 Summarize</option>
        <option value="sentiment">😊 Sentiment</option>
        <option value="ner">🏷️ Entities</option>
          <option value="chat">🏷️ chat</option>
      </select>

      <Button
        aria-label="Re-analyze the document "
        size="sm"
        onClick={() => handleReanalyze(documentId, selectedTask)}
        className={getButtonStyle()}
      >
        Re-analyze ({selectedTask})
      </Button>

      <Button
        name="view-button"
        size="sm"
        variant="outline"
        onClick={() => handleNavigate()}
        aria-label="View details for document "
      >
        View Details
      </Button>
    </div>
  );
}
