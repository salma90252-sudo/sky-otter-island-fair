import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { bucketOf, formatDue, type Task } from "@/lib/tasks/model";

export function TaskRow({
  task,
  listName,
  today,
  active,
  onOpen,
  onToggle,
}: {
  task: Task;
  listName: string;
  today: string;
  active: boolean;
  onOpen: () => void;
  onToggle: () => void;
}) {
  const done = task.status === "done";
  const overdue = bucketOf(task, today) === "overdue";

  return (
    <div
      className={cn(
        "flex items-start gap-2 border-b border-line py-2",
        active && "bg-accent-soft",
      )}
    >
      <button
        type="button"
        role="checkbox"
        aria-checked={done}
        aria-label={done ? `إعادة فتح: ${task.title}` : `إنجاز: ${task.title}`}
        onClick={onToggle}
        className={cn(
          "press mt-1 grid size-11 shrink-0 place-items-center rounded-sm border",
          done ? "border-accent bg-accent text-accent-fg" : "border-faint bg-elevated text-transparent",
        )}
      >
        <Check className="size-4" strokeWidth={2.5} />
      </button>
      <button type="button" onClick={onOpen} className="min-w-0 flex-1 py-2 text-start">
        <span className="flex items-start gap-2">
          <span
            className={cn(
              "mt-2 h-4 w-0.5 shrink-0 rounded-full",
              task.priority === "high" && !done ? "bg-ink" : "bg-transparent",
            )}
            aria-hidden
          />
          <span className="min-w-0">
            <span className={cn("block text-base", done && "text-muted line-through")}>{task.title}</span>
            <span className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted">
              <span>{listName}</span>
              <span className={cn(overdue && "text-danger")}>{formatDue(task.due, today)}</span>
              {task.priority === "high" && !done ? <span className="text-ink">عالية</span> : null}
              {task.status === "doing" ? <span>قيد العمل</span> : null}
            </span>
          </span>
        </span>
      </button>
    </div>
  );
}
