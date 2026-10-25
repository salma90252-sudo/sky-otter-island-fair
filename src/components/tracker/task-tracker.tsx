import * as Dialog from "@radix-ui/react-dialog";
import { Search, X } from "lucide-react";
import { useLayoutEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { controlClass } from "@/components/ui/controls";
import { Board } from "@/components/tracker/board";
import { ConfirmDialog } from "@/components/tracker/confirm-dialog";
import { DetailDialog } from "@/components/tracker/detail-dialog";
import { ListPanel } from "@/components/tracker/list-panel";
import { TaskRow } from "@/components/tracker/task-row";
import { cn } from "@/lib/cn";
import {
  BUCKET_LABEL,
  computeStats,
  filterTasks,
  formatHeading,
  groupByBucket,
  PRIORITIES,
  PRIORITY_LABEL,
  todayISO,
  VIEW_LABEL,
  type Priority,
  type ViewId,
} from "@/lib/tasks/model";
import { useTasks } from "@/lib/tasks/store";

type ConfirmState =
  | { type: "task"; id: string; title: string }
  | { type: "clear-done" }
  | { type: "list"; id: string; name: string }
  | null;

export function TaskTracker() {
  const lists = useTasks((state) => state.lists);
  const tasks = useTasks((state) => state.tasks);
  const addTask = useTasks((state) => state.addTask);
  const updateTask = useTasks((state) => state.updateTask);
  const setStatus = useTasks((state) => state.setStatus);
  const toggleDone = useTasks((state) => state.toggleDone);
  const removeTask = useTasks((state) => state.removeTask);
  const clearDone = useTasks((state) => state.clearDone);
  const addList = useTasks((state) => state.addList);
  const renameList = useTasks((state) => state.renameList);
  const removeList = useTasks((state) => state.removeList);

  const [view, setView] = useState<ViewId>("today");
  const [listId, setListId] = useState("all");
  const [query, setQuery] = useState("");
  const [hideDone, setHideDone] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [manageOpen, setManageOpen] = useState(false);
  const [confirm, setConfirm] = useState<ConfirmState>(null);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("normal");
  const [due, setDue] = useState(() => todayISO());
  const [composeList, setComposeList] = useState("work");

  useLayoutEffect(() => {
    void useTasks.persist.rehydrate();
  }, []);

  const today = todayISO();
  const heading = formatHeading();
  const filedList = lists.some((list) => list.id === (listId === "all" ? composeList : listId))
    ? listId === "all"
      ? composeList
      : listId
    : (lists[0]?.id ?? "inbox");
  const stats = useMemo(() => computeStats(tasks, listId, today), [tasks, listId, today]);
  const visible = useMemo(
    () => filterTasks(tasks, { view, listId, query, hideDone, today }),
    [tasks, view, listId, query, hideDone, today],
  );
  const groups = useMemo(() => groupByBucket(visible, today), [visible, today]);
  const selected = tasks.find((task) => task.id === selectedId) ?? null;
  const progress = stats.todayTotal === 0 ? 0 : Math.round((stats.todayDone / stats.todayTotal) * 100);
  const hasDone = tasks.some(
    (task) => task.status === "done" && (listId === "all" || task.listId === listId),
  );
  const listName = (id: string) => lists.find((list) => list.id === id)?.name ?? "—";

  const confirmCopy = (() => {
    if (confirm?.type === "task") {
      return {
        title: "حذف المهمة",
        body: `ستُحذف «${confirm.title}». لا يمكن التراجع.`,
        confirmLabel: "حذف",
      };
    }
    if (confirm?.type === "list") {
      return {
        title: "حذف القائمة",
        body: `ستُحذف «${confirm.name}» وتنتقل مهامها إلى قائمة أخرى.`,
        confirmLabel: "حذف القائمة",
      };
    }
    if (confirm?.type === "clear-done") {
      return {
        title: "مسح المنجز",
        body: "ستُحذف المهام المنجزة في هذا النطاق. لا يمكن التراجع.",
        confirmLabel: "مسح",
      };
    }
    return null;
  })();

  return (
    <div className="min-h-dvh bg-canvas text-ink lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
      <aside className="sticky top-0 hidden h-dvh flex-col border-e border-line bg-surface px-4 py-6 lg:flex">
        <ListPanel
          lists={lists}
          tasks={tasks}
          listId={listId}
          onSelect={setListId}
          onAdd={addList}
          onRename={renameList}
          onRemove={(id) => {
            const list = lists.find((item) => item.id === id);
            if (list) setConfirm({ type: "list", id, name: list.name });
          }}
        />
      </aside>

      <main
        className={cn(
          "me-auto w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-8",
          view === "board" ? "max-w-6xl" : "max-w-3xl",
        )}
      >
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm text-muted">{heading}</p>
            <h1 className="mt-1 text-3xl font-medium tracking-tight">متتبع المهام</h1>
          </div>
          <div className="relative sm:w-72">
            <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-faint" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="ابحث في المهام"
              aria-label="ابحث في المهام"
              className={cn(controlClass, "bg-elevated ps-10 pe-12")}
            />
            {query ? (
              <button
                type="button"
                aria-label="مسح البحث"
                className="absolute end-0 top-0 grid size-11 place-items-center text-muted"
                onClick={() => setQuery("")}
              >
                <X className="size-4" />
              </button>
            ) : null}
          </div>
        </header>

        <section aria-label="ملخص" className="mt-6 overflow-hidden rounded-xl border border-line bg-line">
          <dl className="grid grid-cols-2 gap-px sm:grid-cols-4">
            <Stat label="مفتوحة" value={stats.open} />
            <Stat label="مستحقة اليوم" value={stats.dueToday} />
            <Stat label="متأخرة" value={stats.overdue} tone={stats.overdue > 0 ? "danger" : "ink"} />
            <Stat label="منجزة اليوم" value={stats.doneToday} tone={stats.doneToday > 0 ? "done" : "ink"} />
          </dl>
        </section>
        {stats.todayTotal > 0 ? (
          <div className="mt-3">
            <div className="mb-2 flex items-center justify-between text-sm text-muted">
              <span>إنجاز مواعيد اليوم</span>
              <span className="tabular-nums">
                {stats.todayDone} / {stats.todayTotal}
              </span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-line">
              <div className="motion-width h-full rounded-full bg-accent" style={{ width: `${progress}%` }} />
            </div>
          </div>
        ) : null}

        <div className="mt-5 flex gap-2 overflow-x-auto lg:hidden">
          <Chip active={listId === "all"} onClick={() => setListId("all")}>
            الكل
          </Chip>
          {lists.map((list) => (
            <Chip key={list.id} active={listId === list.id} onClick={() => setListId(list.id)}>
              {list.name}
            </Chip>
          ))}
          <Chip active={false} onClick={() => setManageOpen(true)}>
            إدارة
          </Chip>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex rounded-sm border border-line bg-elevated p-1" role="tablist" aria-label="طريقة العرض">
            {(Object.keys(VIEW_LABEL) as ViewId[]).map((id) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={view === id}
                onClick={() => setView(id)}
                className={cn(
                  "press h-10 flex-1 rounded-xs px-3 text-sm font-medium sm:flex-none",
                  view === id ? "bg-accent text-accent-fg" : "text-muted",
                )}
              >
                {VIEW_LABEL[id]}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {view !== "today" ? (
              <Button
                variant={hideDone ? "primary" : "ghost"}
                size="sm"
                aria-pressed={hideDone}
                onClick={() => setHideDone((value) => !value)}
              >
                {hideDone ? "إظهار المنجز" : "إخفاء المنجز"}
              </Button>
            ) : null}
            {hasDone ? (
              <Button variant="ghost" size="sm" onClick={() => setConfirm({ type: "clear-done" })}>
                مسح المنجز
              </Button>
            ) : null}
          </div>
        </div>

        <form
          className="mt-5 rounded-xl border border-line bg-elevated p-4"
          onSubmit={(event) => {
            event.preventDefault();
            const nextTitle = title.trim();
            if (!nextTitle) return;
            addTask({
              title: nextTitle,
              listId: filedList,
              priority,
              due: due || null,
            });
            setTitle("");
          }}
        >
          <label htmlFor="new-task" className="sr-only">
            مهمة جديدة
          </label>
          <input
            id="new-task"
            value={title}
            maxLength={160}
            placeholder="ما الذي تريد إنجازه؟"
            className="h-11 w-full bg-transparent text-base outline-none placeholder:text-faint"
            onChange={(event) => setTitle(event.target.value)}
          />
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            <select
              aria-label="قائمة المهمة"
              value={filedList}
              className={cn(controlClass, "bg-canvas sm:w-auto")}
              onChange={(event) => {
                const next = event.target.value;
                if (listId === "all") setComposeList(next);
                else setListId(next);
              }}
            >
              {lists.map((list) => (
                <option key={list.id} value={list.id}>
                  {list.name}
                </option>
              ))}
            </select>
            <input
              type="date"
              aria-label="موعد المهمة"
              value={due}
              className={cn(controlClass, "bg-canvas sm:w-auto")}
              onChange={(event) => setDue(event.target.value)}
            />
            <select
              aria-label="أولوية المهمة"
              value={priority}
              className={cn(controlClass, "bg-canvas sm:w-auto")}
              onChange={(event) => setPriority(event.target.value as Priority)}
            >
              {PRIORITIES.map((item) => (
                <option key={item} value={item}>
                  أولوية {PRIORITY_LABEL[item]}
                </option>
              ))}
            </select>
            <Button type="submit" disabled={!title.trim()} className="sm:ms-auto">
              إضافة
            </Button>
          </div>
        </form>

        <div className="mt-6">
          {view === "board" ? (
            <Board
              tasks={visible}
              today={today}
              listName={listName}
              onOpen={setSelectedId}
              onToggle={toggleDone}
              onStatus={setStatus}
            />
          ) : visible.length === 0 ? (
            <Empty view={view} query={query} />
          ) : (
            <div>
              {groups.map((group) => (
                <section key={group.bucket} className="mb-6">
                  <h2
                    aria-label={`${BUCKET_LABEL[group.bucket]} ${group.tasks.length}`}
                    className={cn(
                      "mb-1 text-sm font-medium",
                      group.bucket === "overdue" ? "text-danger" : "text-muted",
                    )}
                  >
                    {BUCKET_LABEL[group.bucket]}
                    <span className="ms-2 tabular-nums">{group.tasks.length}</span>
                  </h2>
                  {group.tasks.map((task) => (
                    <TaskRow
                      key={task.id}
                      task={task}
                      today={today}
                      listName={listName(task.listId)}
                      active={task.id === selectedId}
                      onOpen={() => setSelectedId(task.id)}
                      onToggle={() => toggleDone(task.id)}
                    />
                  ))}
                </section>
              ))}
            </div>
          )}
        </div>
      </main>

      <Dialog.Root open={manageOpen} onOpenChange={setManageOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="modal-overlay fixed inset-0 z-40 bg-ink/35" />
          <Dialog.Content className="center-pop max-h-[80dvh] overflow-y-auto rounded-xl border border-line bg-surface p-5 outline-none">
            <div className="mb-4 flex items-center justify-between">
              <Dialog.Title className="text-xl font-medium">القوائم</Dialog.Title>
              <Dialog.Close asChild>
                <Button variant="quiet" size="icon" aria-label="إغلاق">
                  <X className="size-5" />
                </Button>
              </Dialog.Close>
            </div>
            <Dialog.Description className="sr-only">أضف قائمة أو عدّل أسماء القوائم.</Dialog.Description>
            <ListPanel
              lists={lists}
              tasks={tasks}
              listId={listId}
              onSelect={(id) => {
                setListId(id);
                setManageOpen(false);
              }}
              onAdd={addList}
              onRename={renameList}
              onRemove={(id) => {
                const list = lists.find((item) => item.id === id);
                if (list) setConfirm({ type: "list", id, name: list.name });
              }}
            />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <DetailDialog
        task={selected}
        lists={lists}
        onClose={() => setSelectedId(null)}
        onUpdate={(patch) => {
          if (selected) updateTask(selected.id, patch);
        }}
        onStatus={(status) => {
          if (selected) setStatus(selected.id, status);
        }}
        onDelete={() => {
          if (selected) setConfirm({ type: "task", id: selected.id, title: selected.title });
        }}
      />

      <ConfirmDialog
        open={confirm != null}
        title={confirmCopy?.title ?? ""}
        body={confirmCopy?.body ?? ""}
        confirmLabel={confirmCopy?.confirmLabel ?? "تأكيد"}
        onOpenChange={(open) => {
          if (!open) setConfirm(null);
        }}
        onConfirm={() => {
          if (confirm?.type === "task") {
            removeTask(confirm.id);
            setSelectedId((current) => (current === confirm.id ? null : current));
          } else if (confirm?.type === "list") {
            removeList(confirm.id);
            setListId((current) => (current === confirm.id ? "all" : current));
          } else if (confirm?.type === "clear-done") {
            clearDone(listId);
          }
          setConfirm(null);
        }}
      />
    </div>
  );
}

function Stat({
  label,
  value,
  tone = "ink",
}: {
  label: string;
  value: number;
  tone?: "ink" | "danger" | "done";
}) {
  return (
    <div className="bg-surface px-4 py-3">
      <dt className="text-sm text-muted">{label}</dt>
      <dd
        className={cn(
          "mt-1 text-2xl font-medium tabular-nums tracking-tight",
          tone === "danger" && "text-danger",
          tone === "done" && "text-done",
        )}
      >
        {value}
      </dd>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "press h-11 shrink-0 rounded-full border px-4 text-sm font-medium",
        active ? "border-ink bg-accent text-accent-fg" : "border-line bg-elevated text-ink",
      )}
    >
      {children}
    </button>
  );
}

function Empty({ view, query }: { view: ViewId; query: string }) {
  const searching = query.trim().length > 0;
  const title = searching ? "لا نتائج" : view === "today" ? "لا مهام مستحقة اليوم" : "لا مهام";
  const body = searching
    ? "لا توجد مهمة تطابق البحث."
    : view === "today"
      ? "المتأخر وما يحل موعده اليوم يظهر هنا."
      : "أضف مهمة جديدة من الحقل أعلاه.";
  return (
    <div className="rounded-xl border border-line px-6 py-12 text-center">
      <p className="text-base font-medium">{title}</p>
      <p className="mt-2 text-sm text-muted">{body}</p>
    </div>
  );
}
