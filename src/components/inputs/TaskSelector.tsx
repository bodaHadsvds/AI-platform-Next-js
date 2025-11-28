import { TaskType } from "@/types/document";

interface TaskSelectorProps {
  selectedTask:TaskType;
  setSelectedTask: (value: TaskType) => void;
}

export const TaskSelector: React.FC<TaskSelectorProps> = ({
  selectedTask,
  setSelectedTask,
}) => {
  const tasks : { id: TaskType; label: string; color: string }[] = [
    { id: "summarization", label: "Summarization", color: "text-blue-800" },
    { id: "sentiment", label: "Sentiment", color: "text-green-800" },
    { id: "ner", label: "Entities", color: "text-orange-800" },
        { id: "chat", label: "chat", color: "text-yellow-800" },
  ];

  return (
    <div className="flex x flex-col sm:flex-row  items-center  sm:gap-2 gap-4">
      {tasks.map(({ id, label, color }) => (
        <label
          htmlFor={`task-${id}`}
          key={id}
          className="flex items-center gap-2 cursor-pointer"
        >
          <input
            type="radio"
            name="task"
              id={`task-${id}`}
            value={id}
            checked={selectedTask === id}
            onChange={() => setSelectedTask(id)}
          />
          <span className={`${color} font-medium`}>{label}</span>
        </label>
      ))}
    </div>
  );
};
