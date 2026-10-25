import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { controlClass } from "@/components/ui/controls";
import { cn } from "@/lib/cn";
import { openCount, type Task, type TaskList } from "@/lib/tasks/model";

export function ListPanel({
  lists,
  tasks,
  listId,
  onSelect,
  onAdd,
  onRename,
  onRemove,
}: {
  lists: TaskList[];
  tasks: Task[];
  listId: string;
  onSelect: (id: string) => void;
  onAdd: (name: string) => void;
  onRename: (id: string, name: string) => void;
  onRemove: (id: string) => void;
}) {
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [creating, setCreating] = useState("");

  useEffect(() => {
    if (editing && !lists.some((list) => list.id === editing)) setEditing(null);
  }, [editing, lists]);

  const totalOpen = tasks.filter((task) => task.status !== "done").length;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <p className="px-1 text-sm font-medium text-muted">القوائم</p>
      <div className="mt-3 flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto">
        <ListButton
          active={listId === "all"}
          label="كل القوائم"
          count={totalOpen}
          onClick={() => onSelect("all")}
        />
        {lists.map((list) =>
          editing === list.id ? (
            <form
              key={list.id}
              className="flex flex-col gap-2 rounded-sm bg-canvas p-2"
              onSubmit={(event) => {
                event.preventDefault();
                onRename(list.id, draft);
                setEditing(null);
              }}
            >
              <input
                autoFocus
                value={draft}
                maxLength={40}
                aria-label="اسم القائمة"
                className={controlClass}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") setEditing(null);
                }}
              />
              <div className="flex gap-2">
                <Button type="submit" size="sm" className="flex-1">
                  حفظ
                </Button>
                <Button type="button" size="sm" variant="ghost" onClick={() => setEditing(null)}>
                  إلغاء
                </Button>
              </div>
              {lists.length > 1 ? (
                <button
                  type="button"
                  className="h-10 text-sm text-danger"
                  onClick={() => onRemove(list.id)}
                >
                  حذف القائمة
                </button>
              ) : null}
            </form>
          ) : (
            <div key={list.id} className="flex items-center gap-1">
              <ListButton
                active={listId === list.id}
                label={list.name}
                count={openCount(tasks, list.id)}
                onClick={() => onSelect(list.id)}
              />
              <button
                type="button"
                className="press grid size-11 shrink-0 place-items-center rounded-sm text-muted hover:bg-accent-soft"
                aria-label={`تعديل ${list.name}`}
                onClick={() => {
                  setEditing(list.id);
                  setDraft(list.name);
                }}
              >
                <Pencil className="size-4" />
              </button>
            </div>
          ),
        )}
      </div>
      <form
        className="mt-4 flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          onAdd(creating);
          setCreating("");
        }}
      >
        <input
          value={creating}
          maxLength={40}
          placeholder="قائمة جديدة"
          aria-label="قائمة جديدة"
          className={controlClass}
          onChange={(event) => setCreating(event.target.value)}
        />
        <Button type="submit" disabled={!creating.trim()}>
          إضافة
        </Button>
      </form>
      <p className="mt-4 text-sm text-faint">تُحفظ مهامك على هذا الجهاز فقط.</p>
    </div>
  );
}

function ListButton({
  active,
  label,
  count,
  onClick,
}: {
  active: boolean;
  label: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-11 min-w-0 flex-1 items-center justify-between gap-3 rounded-sm px-3 text-start text-base",
        active ? "bg-accent text-accent-fg" : "hover:bg-accent-soft",
      )}
    >
      <span className="truncate">{label}</span>
      <span className="tabular-nums">{count}</span>
    </button>
  );
}
