import { useState } from "react";
import { Check, GripVertical } from "lucide-react";
import { cn } from "@/lib/cn";
import {
  bucketOf,
  formatDue,
  STATUSES,
  STATUS_LABEL,
  type Status,
  type Task,
} from "@/lib/tasks/model";

export function Board({
  tasks,
  listName,
  today,
  onOpen,
  onToggle,
  onStatus,
}: {
  tasks: Task[];
  listName: (id: string) => string;
  today: string;
  onOpen: (id: string) => void;
  onToggle: (id: string) => void;
  onStatus: (id: string, status: Status) => void;
}) {
  const [over, setOver] = useState<Status | null>(null);

  return (
    <div className="grid gap-6 lg:grid-cols-3 lg:items-start lg:gap-4">
      {STATUSES.map((status) => {
        const column = tasks.filter((task) => task.status === status);
        return (
          <section
            key={status}
            aria-label={STATUS_LABEL[status]}
            onDragOver={(event) => {
              event.preventDefault();
              setOver(status);
            }}
            onDragLeave={() => setOver((current) => (current === status ? null : current))}
            onDrop={(event) => {
              event.preventDefault();
              const id = event.dataTransfer.getData("text/plain");
              setOver(null);
              if (id) onStatus(id, status);
            }}
            className={cn("min-h-24 rounded-xl p-2", over === status && "bg-accent-soft")}
          >
            <h2
              aria-label={`${STATUS_LABEL[status]} ${column.length}`}
              className="mb-2 flex items-center justify-between px-2 text-sm font-medium text-muted"
            >
              <span>{STATUS_LABEL[status]}</span>
              <span className="tabular-nums">{column.length}</span>
            </h2>
            <div className="flex flex-col gap-3">
              {column.length === 0 ? <p className="px-2 py-6 text-sm text-faint">لا مهام</p> : null}
              {column.map((task) => {
                const done = task.status === "done";
                const overdue = bucketOf(task, today) === "overdue";
                return (
                  <article key={task.id} className="rounded-xl border border-line bg-elevated p-4">
                    <div className="flex items-start gap-1">
                      <button
                        type="button"
                        className="drag-handle grid size-11 shrink-0 place-items-center text-faint"
                        aria-label="اسحب لتغيير الحالة"
                        draggable
                        onDragStart={(event) => {
                          event.dataTransfer.setData("text/plain", task.id);
                          event.dataTransfer.effectAllowed = "move";
                        }}
                      >
                        <GripVertical className="size-4" />
                      </button>
                      <button
                        type="button"
                        role="checkbox"
                        aria-checked={done}
                        aria-label={done ? `إعادة فتح: ${task.title}` : `إنجاز: ${task.title}`}
                        onClick={() => onToggle(task.id)}
                        className={cn(
                          "press grid size-11 shrink-0 place-items-center rounded-sm border",
                          done
                            ? "border-accent bg-accent text-accent-fg"
                            : "border-faint bg-canvas text-transparent",
                        )}
                      >
                        <Check className="size-4" strokeWidth={2.5} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpen(task.id)}
                        className="min-w-0 flex-1 py-2 text-start"
                      >
                        <span className={cn("block text-base", done && "text-muted line-through")}>
                          {task.title}
                        </span>
                        <span className="mt-1 flex flex-wrap gap-x-3 text-sm text-muted">
                          <span>{listName(task.listId)}</span>
                          <span className={cn(overdue && "text-danger")}>{formatDue(task.due, today)}</span>
                        </span>
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
