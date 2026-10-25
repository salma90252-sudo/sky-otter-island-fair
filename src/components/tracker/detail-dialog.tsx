import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { controlClass, Segmented } from "@/components/ui/controls";
import {
  PRIORITIES,
  PRIORITY_LABEL,
  STATUSES,
  STATUS_LABEL,
  type Priority,
  type Status,
  type Task,
  type TaskList,
} from "@/lib/tasks/model";
import type { TaskPatch } from "@/lib/tasks/store";

export function DetailDialog({
  task,
  lists,
  onClose,
  onUpdate,
  onStatus,
  onDelete,
}: {
  task: Task | null;
  lists: TaskList[];
  onClose: () => void;
  onUpdate: (patch: TaskPatch) => void;
  onStatus: (status: Status) => void;
  onDelete: () => void;
}) {
  return (
    <Dialog.Root open={task != null} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="drawer-overlay fixed inset-0 z-40 bg-ink/35" />
        <Dialog.Content className="drawer-panel fixed inset-y-0 end-0 z-40 flex w-full max-w-md flex-col border-s border-line bg-surface outline-none">
          <div className="flex items-center justify-between border-b border-line px-4 py-2">
            <Dialog.Title className="text-base font-medium">تفاصيل المهمة</Dialog.Title>
            <Dialog.Close asChild>
              <Button variant="quiet" size="icon" aria-label="إغلاق">
                <X className="size-5" />
              </Button>
            </Dialog.Close>
          </div>
          {task ? (
            <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-4 py-5">
              <Dialog.Description className="sr-only">عدّل العنوان أو الموعد أو الحالة.</Dialog.Description>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-muted">العنوان</span>
                <input
                  value={task.title}
                  maxLength={160}
                  className={controlClass}
                  onChange={(event) => onUpdate({ title: event.target.value })}
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-muted">ملاحظات</span>
                <textarea
                  value={task.notes}
                  maxLength={2000}
                  rows={5}
                  placeholder="تفاصيل إضافية"
                  className="w-full resize-y rounded-md border border-line bg-canvas px-3 py-3 text-base"
                  onChange={(event) => onUpdate({ notes: event.target.value })}
                />
              </label>
              <Segmented
                label="الحالة"
                value={task.status}
                options={STATUSES.map((id) => ({ id, label: STATUS_LABEL[id] }))}
                onChange={onStatus}
              />
              <Segmented
                label="الأولوية"
                value={task.priority}
                options={PRIORITIES.map((id) => ({ id, label: PRIORITY_LABEL[id] }))}
                onChange={(priority: Priority) => onUpdate({ priority })}
              />
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label htmlFor="task-due" className="text-sm font-medium text-muted">
                    الموعد
                  </label>
                  {task.due ? (
                    <button
                      type="button"
                      className="text-sm text-muted"
                      onClick={() => onUpdate({ due: null })}
                    >
                      إزالة الموعد
                    </button>
                  ) : null}
                </div>
                <input
                  id="task-due"
                  type="date"
                  value={task.due ?? ""}
                  className={controlClass}
                  onChange={(event) => onUpdate({ due: event.target.value || null })}
                />
              </div>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-muted">القائمة</span>
                <select
                  value={task.listId}
                  className={controlClass}
                  onChange={(event) => onUpdate({ listId: event.target.value })}
                >
                  {lists.map((list) => (
                    <option key={list.id} value={list.id}>
                      {list.name}
                    </option>
                  ))}
                </select>
              </label>
              <Button variant="danger" onClick={onDelete}>
                حذف المهمة
              </Button>
            </div>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
