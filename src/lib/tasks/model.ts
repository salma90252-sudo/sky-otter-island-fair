export type Priority = "low" | "normal" | "high";
export type Status = "open" | "doing" | "done";
export type ViewId = "today" | "list" | "board";

export interface TaskList {
  id: string;
  name: string;
}

export interface Task {
  id: string;
  title: string;
  notes: string;
  listId: string;
  priority: Priority;
  status: Status;
  due: string | null;
  createdAt: number;
  completedAt: number | null;
}

export const PRIORITIES: Priority[] = ["low", "normal", "high"];
export const STATUSES: Status[] = ["open", "doing", "done"];

export const PRIORITY_LABEL: Record<Priority, string> = {
  low: "منخفضة",
  normal: "عادية",
  high: "عالية",
};

export const STATUS_LABEL: Record<Status, string> = {
  open: "للقيام",
  doing: "قيد العمل",
  done: "تم",
};

export const VIEW_LABEL: Record<ViewId, string> = {
  today: "اليوم",
  list: "القائمة",
  board: "اللوحة",
};

export const BUCKET_LABEL = {
  overdue: "متأخرة",
  today: "اليوم",
  tomorrow: "غداً",
  later: "لاحقاً",
  none: "بلا موعد",
  done: "منجزة",
} as const;

export type Bucket = keyof typeof BUCKET_LABEL;

export function todayISO(now = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function shiftISO(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1);
  date.setDate(date.getDate() + days);
  return todayISO(date);
}

export function formatHeading(now = new Date()): string {
  return new Intl.DateTimeFormat("ar", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(now);
}

export function formatDue(iso: string | null, today: string): string {
  if (!iso) return "بلا موعد";
  if (iso === today) return "اليوم";
  if (iso === shiftISO(today, 1)) return "غداً";
  if (iso === shiftISO(today, -1)) return "أمس";
  const [y, m, d] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat("ar", {
    day: "numeric",
    month: "short",
  }).format(new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1));
}

export function bucketOf(task: Task, today: string): Bucket {
  if (task.status === "done") return "done";
  if (!task.due) return "none";
  if (task.due < today) return "overdue";
  if (task.due === today) return "today";
  if (task.due === shiftISO(today, 1)) return "tomorrow";
  return "later";
}

const priorityRank: Record<Priority, number> = { high: 0, normal: 1, low: 2 };
const bucketRank: Record<Bucket, number> = {
  overdue: 0,
  today: 1,
  tomorrow: 2,
  later: 3,
  none: 4,
  done: 5,
};

export function compareTasks(a: Task, b: Task, today: string): number {
  const byBucket = bucketRank[bucketOf(a, today)] - bucketRank[bucketOf(b, today)];
  if (byBucket !== 0) return byBucket;
  const byPriority = priorityRank[a.priority] - priorityRank[b.priority];
  if (byPriority !== 0) return byPriority;
  const dueA = a.due ?? "9999-99-99";
  const dueB = b.due ?? "9999-99-99";
  if (dueA !== dueB) return dueA < dueB ? -1 : 1;
  return a.createdAt - b.createdAt;
}

export function inView(task: Task, view: ViewId, today: string): boolean {
  if (view !== "today") return true;
  if (task.status === "done") {
    return task.completedAt != null && todayISO(new Date(task.completedAt)) === today;
  }
  return task.due != null && task.due <= today;
}

export interface FilterOpts {
  view: ViewId;
  listId: string;
  query: string;
  hideDone: boolean;
  today: string;
}

export function filterTasks(tasks: Task[], opts: FilterOpts): Task[] {
  const query = opts.query.trim();
  return tasks
    .filter((task) => {
      if (opts.listId !== "all" && task.listId !== opts.listId) return false;
      if (opts.hideDone && opts.view !== "today" && task.status === "done") return false;
      if (query && !task.title.includes(query) && !task.notes.includes(query)) return false;
      return inView(task, opts.view, opts.today);
    })
    .sort((a, b) => compareTasks(a, b, opts.today));
}

export function groupByBucket(tasks: Task[], today: string): { bucket: Bucket; tasks: Task[] }[] {
  const order: Bucket[] = ["overdue", "today", "tomorrow", "later", "none", "done"];
  const map = new Map<Bucket, Task[]>();
  for (const task of tasks) {
    const bucket = bucketOf(task, today);
    const list = map.get(bucket);
    if (list) list.push(task);
    else map.set(bucket, [task]);
  }
  return order
    .filter((bucket) => map.has(bucket))
    .map((bucket) => ({ bucket, tasks: map.get(bucket) ?? [] }));
}

export interface Stats {
  open: number;
  dueToday: number;
  overdue: number;
  doneToday: number;
  todayTotal: number;
  todayDone: number;
}

export function computeStats(tasks: Task[], listId: string, today: string): Stats {
  const stats: Stats = {
    open: 0,
    dueToday: 0,
    overdue: 0,
    doneToday: 0,
    todayTotal: 0,
    todayDone: 0,
  };
  for (const task of tasks) {
    if (listId !== "all" && task.listId !== listId) continue;
    const finishedToday =
      task.status === "done" &&
      task.completedAt != null &&
      todayISO(new Date(task.completedAt)) === today;
    if (task.status !== "done") stats.open += 1;
    if (task.status !== "done" && task.due === today) stats.dueToday += 1;
    if (task.status !== "done" && task.due != null && task.due < today) stats.overdue += 1;
    if (finishedToday) stats.doneToday += 1;
    if (task.due === today) {
      stats.todayTotal += 1;
      if (task.status === "done") stats.todayDone += 1;
    }
  }
  return stats;
}

export function openCount(tasks: Task[], listId: string): number {
  return tasks.reduce((count, task) => {
    if (task.listId !== listId || task.status === "done") return count;
    return count + 1;
  }, 0);
}

export function uid(prefix: string): string {
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}-${Date.now().toString(36)}-${rand}`;
}

function atShift(days: number, hours: number): number {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hours, 0, 0, 0);
  return date.getTime();
}

export function seedLists(): TaskList[] {
  return [
    { id: "inbox", name: "الوارد" },
    { id: "work", name: "العمل" },
    { id: "home", name: "البيت" },
    { id: "personal", name: "الشخصي" },
  ];
}

export function seedTasks(): Task[] {
  const today = todayISO();
  return [
    {
      id: "seed-budget",
      title: "تسليم مسودة الميزانية",
      notes: "أرفق جدول المقارنة مع الربع الماضي قبل الإرسال.",
      listId: "work",
      priority: "high",
      status: "open",
      due: shiftISO(today, -1),
      createdAt: 1,
      completedAt: null,
    },
    {
      id: "seed-pitch",
      title: "مراجعة عرض العميل قبل الاجتماع",
      notes: "راجع الأرقام والجدول الزمني، وجهّز سؤالين للاعتراضات المتوقعة.",
      listId: "work",
      priority: "high",
      status: "doing",
      due: today,
      createdAt: 2,
      completedAt: null,
    },
    {
      id: "seed-minutes",
      title: "إرسال محضر اجتماع الأمس",
      notes: "انسخ القرارات إلى رسالة قصيرة للفريق.",
      listId: "work",
      priority: "normal",
      status: "open",
      due: today,
      createdAt: 3,
      completedAt: null,
    },
    {
      id: "seed-dinner",
      title: "تحضير عشاء الضيوف",
      notes: "سلطة، دجاج بالفرن، وفاكهة. التسوق قبل الرابعة.",
      listId: "home",
      priority: "high",
      status: "open",
      due: today,
      createdAt: 4,
      completedAt: null,
    },
    {
      id: "seed-walk",
      title: "المشي الصباحي",
      notes: "",
      listId: "personal",
      priority: "low",
      status: "done",
      due: today,
      createdAt: 5,
      completedAt: atShift(0, 7),
    },
    {
      id: "seed-dentist",
      title: "حجز موعد طبيب الأسنان",
      notes: "يفضّل صباحاً في الأسبوع القادم.",
      listId: "personal",
      priority: "normal",
      status: "open",
      due: shiftISO(today, 1),
      createdAt: 6,
      completedAt: null,
    },
    {
      id: "seed-lamps",
      title: "شراء مصابيح للمطبخ",
      notes: "ضوء دافئ، قاعدتان.",
      listId: "home",
      priority: "low",
      status: "open",
      due: shiftISO(today, 3),
      createdAt: 7,
      completedAt: null,
    },
    {
      id: "seed-book",
      title: "قراءة الفصل الثالث",
      notes: "دوّن ثلاث أفكار قبل النوم.",
      listId: "inbox",
      priority: "normal",
      status: "open",
      due: null,
      createdAt: 8,
      completedAt: null,
    },
    {
      id: "seed-mail",
      title: "الرد على رسائل الفريق",
      notes: "",
      listId: "work",
      priority: "low",
      status: "done",
      due: shiftISO(today, -1),
      createdAt: 9,
      completedAt: atShift(-1, 16),
    },
  ];
}
