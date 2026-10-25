import { i as __toESM } from "../_runtime.mjs";
import { _ as require_jsx_runtime, a as AlertDialogDescription, c as AlertDialogTitle, d as DialogContent, f as DialogDescription, h as DialogTitle, i as AlertDialogContent, l as Dialog, m as DialogPortal, n as AlertDialogAction, o as AlertDialogOverlay, p as DialogOverlay, r as AlertDialogCancel, s as AlertDialogPortal, t as AlertDialog, u as DialogClose, v as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as GripVertical, i as Pencil, o as Check, r as Search, t as X } from "../_libs/lucide-react.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-AxT7ZAdb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("press inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap", {
	variants: {
		variant: {
			primary: "bg-accent text-accent-fg",
			ghost: "bg-elevated text-ink border border-line",
			quiet: "text-muted hover:bg-accent-soft hover:text-ink",
			danger: "bg-danger text-danger-fg"
		},
		size: {
			md: "h-11 rounded-sm px-4 text-base",
			sm: "h-10 rounded-sm px-3 text-sm",
			icon: "size-11 rounded-sm"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "md"
	}
});
var Button = (0, import_react.forwardRef)(function Button({ className, variant, size, type = "button", ...props }, ref) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		ref,
		type,
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
});
var controlClass = "h-11 w-full rounded-sm border border-line bg-canvas px-3 text-base text-ink";
function Segmented({ label, value, options, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mb-2 text-sm font-medium text-muted",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex rounded-sm border border-line bg-canvas p-1",
		role: "radiogroup",
		"aria-label": label,
		children: options.map((option) => {
			const active = option.id === value;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				role: "radio",
				"aria-checked": active,
				onClick: () => onChange(option.id),
				className: cn("press h-10 flex-1 rounded-xs text-sm font-medium", active ? "bg-accent text-accent-fg" : "text-muted"),
				children: option.label
			}, option.id);
		})
	})] });
}
var PRIORITIES = [
	"low",
	"normal",
	"high"
];
var STATUSES = [
	"open",
	"doing",
	"done"
];
var PRIORITY_LABEL = {
	low: "منخفضة",
	normal: "عادية",
	high: "عالية"
};
var STATUS_LABEL = {
	open: "للقيام",
	doing: "قيد العمل",
	done: "تم"
};
var VIEW_LABEL = {
	today: "اليوم",
	list: "القائمة",
	board: "اللوحة"
};
var BUCKET_LABEL = {
	overdue: "متأخرة",
	today: "اليوم",
	tomorrow: "غداً",
	later: "لاحقاً",
	none: "بلا موعد",
	done: "منجزة"
};
function todayISO(now = /* @__PURE__ */ new Date()) {
	return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}
function shiftISO(iso, days) {
	const [y, m, d] = iso.split("-").map(Number);
	const date = new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1);
	date.setDate(date.getDate() + days);
	return todayISO(date);
}
function formatHeading(now = /* @__PURE__ */ new Date()) {
	return new Intl.DateTimeFormat("ar", {
		weekday: "long",
		day: "numeric",
		month: "long"
	}).format(now);
}
function formatDue(iso, today) {
	if (!iso) return "بلا موعد";
	if (iso === today) return "اليوم";
	if (iso === shiftISO(today, 1)) return "غداً";
	if (iso === shiftISO(today, -1)) return "أمس";
	const [y, m, d] = iso.split("-").map(Number);
	return new Intl.DateTimeFormat("ar", {
		day: "numeric",
		month: "short"
	}).format(new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1));
}
function bucketOf(task, today) {
	if (task.status === "done") return "done";
	if (!task.due) return "none";
	if (task.due < today) return "overdue";
	if (task.due === today) return "today";
	if (task.due === shiftISO(today, 1)) return "tomorrow";
	return "later";
}
var priorityRank = {
	high: 0,
	normal: 1,
	low: 2
};
var bucketRank = {
	overdue: 0,
	today: 1,
	tomorrow: 2,
	later: 3,
	none: 4,
	done: 5
};
function compareTasks(a, b, today) {
	const byBucket = bucketRank[bucketOf(a, today)] - bucketRank[bucketOf(b, today)];
	if (byBucket !== 0) return byBucket;
	const byPriority = priorityRank[a.priority] - priorityRank[b.priority];
	if (byPriority !== 0) return byPriority;
	const dueA = a.due ?? "9999-99-99";
	const dueB = b.due ?? "9999-99-99";
	if (dueA !== dueB) return dueA < dueB ? -1 : 1;
	return a.createdAt - b.createdAt;
}
function inView(task, view, today) {
	if (view !== "today") return true;
	if (task.status === "done") return task.completedAt != null && todayISO(new Date(task.completedAt)) === today;
	return task.due != null && task.due <= today;
}
function filterTasks(tasks, opts) {
	const query = opts.query.trim();
	return tasks.filter((task) => {
		if (opts.listId !== "all" && task.listId !== opts.listId) return false;
		if (opts.hideDone && opts.view !== "today" && task.status === "done") return false;
		if (query && !task.title.includes(query) && !task.notes.includes(query)) return false;
		return inView(task, opts.view, opts.today);
	}).sort((a, b) => compareTasks(a, b, opts.today));
}
function groupByBucket(tasks, today) {
	const order = [
		"overdue",
		"today",
		"tomorrow",
		"later",
		"none",
		"done"
	];
	const map = /* @__PURE__ */ new Map();
	for (const task of tasks) {
		const bucket = bucketOf(task, today);
		const list = map.get(bucket);
		if (list) list.push(task);
		else map.set(bucket, [task]);
	}
	return order.filter((bucket) => map.has(bucket)).map((bucket) => ({
		bucket,
		tasks: map.get(bucket) ?? []
	}));
}
function computeStats(tasks, listId, today) {
	const stats = {
		open: 0,
		dueToday: 0,
		overdue: 0,
		doneToday: 0,
		todayTotal: 0,
		todayDone: 0
	};
	for (const task of tasks) {
		if (listId !== "all" && task.listId !== listId) continue;
		const finishedToday = task.status === "done" && task.completedAt != null && todayISO(new Date(task.completedAt)) === today;
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
function openCount(tasks, listId) {
	return tasks.reduce((count, task) => {
		if (task.listId !== listId || task.status === "done") return count;
		return count + 1;
	}, 0);
}
function uid(prefix) {
	const rand = Math.random().toString(36).slice(2, 8);
	return `${prefix}-${Date.now().toString(36)}-${rand}`;
}
function atShift(days, hours) {
	const date = /* @__PURE__ */ new Date();
	date.setDate(date.getDate() + days);
	date.setHours(hours, 0, 0, 0);
	return date.getTime();
}
function seedLists() {
	return [
		{
			id: "inbox",
			name: "الوارد"
		},
		{
			id: "work",
			name: "العمل"
		},
		{
			id: "home",
			name: "البيت"
		},
		{
			id: "personal",
			name: "الشخصي"
		}
	];
}
function seedTasks() {
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
			completedAt: null
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
			completedAt: null
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
			completedAt: null
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
			completedAt: null
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
			completedAt: atShift(0, 7)
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
			completedAt: null
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
			completedAt: null
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
			completedAt: null
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
			completedAt: atShift(-1, 16)
		}
	];
}
function Board({ tasks, listName, today, onOpen, onToggle, onStatus }) {
	const [over, setOver] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-6 lg:grid-cols-3 lg:items-start lg:gap-4",
		children: STATUSES.map((status) => {
			const column = tasks.filter((task) => task.status === status);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				"aria-label": STATUS_LABEL[status],
				onDragOver: (event) => {
					event.preventDefault();
					setOver(status);
				},
				onDragLeave: () => setOver((current) => current === status ? null : current),
				onDrop: (event) => {
					event.preventDefault();
					const id = event.dataTransfer.getData("text/plain");
					setOver(null);
					if (id) onStatus(id, status);
				},
				className: cn("min-h-24 rounded-xl p-2", over === status && "bg-accent-soft"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					"aria-label": `${STATUS_LABEL[status]} ${column.length}`,
					className: "mb-2 flex items-center justify-between px-2 text-sm font-medium text-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: STATUS_LABEL[status] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tabular-nums",
						children: column.length
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3",
					children: [column.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "px-2 py-6 text-sm text-faint",
						children: "لا مهام"
					}) : null, column.map((task) => {
						const done = task.status === "done";
						const overdue = bucketOf(task, today) === "overdue";
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
							className: "rounded-xl border border-line bg-elevated p-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "drag-handle grid size-11 shrink-0 place-items-center text-faint",
										"aria-label": "اسحب لتغيير الحالة",
										draggable: true,
										onDragStart: (event) => {
											event.dataTransfer.setData("text/plain", task.id);
											event.dataTransfer.effectAllowed = "move";
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GripVertical, { className: "size-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										role: "checkbox",
										"aria-checked": done,
										"aria-label": done ? `إعادة فتح: ${task.title}` : `إنجاز: ${task.title}`,
										onClick: () => onToggle(task.id),
										className: cn("press grid size-11 shrink-0 place-items-center rounded-sm border", done ? "border-accent bg-accent text-accent-fg" : "border-faint bg-canvas text-transparent"),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
											className: "size-4",
											strokeWidth: 2.5
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => onOpen(task.id),
										className: "min-w-0 flex-1 py-2 text-start",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: cn("block text-base", done && "text-muted line-through"),
											children: task.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "mt-1 flex flex-wrap gap-x-3 text-sm text-muted",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: listName(task.listId) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: cn(overdue && "text-danger"),
												children: formatDue(task.due, today)
											})]
										})]
									})
								]
							})
						}, task.id);
					})]
				})]
			}, status);
		})
	});
}
function ConfirmDialog({ open, title, body, confirmLabel, onConfirm, onOpenChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogOverlay, { className: "modal-overlay fixed inset-0 z-50 bg-ink/40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, {
			className: "center-pop rounded-xl border border-line bg-elevated p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, {
					className: "text-xl font-medium",
					children: title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, {
					className: "mt-2 text-base text-muted",
					children: body
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-end gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							children: "إلغاء"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "danger",
							onClick: onConfirm,
							children: confirmLabel
						})
					})]
				})
			]
		})] })
	});
}
function DetailDialog({ task, lists, onClose, onUpdate, onStatus, onDelete }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: task != null,
		onOpenChange: (open) => !open && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "drawer-overlay fixed inset-0 z-40 bg-ink/35" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "drawer-panel fixed inset-y-0 end-0 z-40 flex w-full max-w-md flex-col border-s border-line bg-surface outline-none",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-b border-line px-4 py-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
					className: "text-base font-medium",
					children: "تفاصيل المهمة"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogClose, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "quiet",
						size: "icon",
						"aria-label": "إغلاق",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
					})
				})]
			}), task ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-1 flex-col gap-5 overflow-y-auto px-4 py-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
						className: "sr-only",
						children: "عدّل العنوان أو الموعد أو الحالة."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mb-2 block text-sm font-medium text-muted",
							children: "العنوان"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: task.title,
							maxLength: 160,
							className: controlClass,
							onChange: (event) => onUpdate({ title: event.target.value })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mb-2 block text-sm font-medium text-muted",
							children: "ملاحظات"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: task.notes,
							maxLength: 2e3,
							rows: 5,
							placeholder: "تفاصيل إضافية",
							className: "w-full resize-y rounded-md border border-line bg-canvas px-3 py-3 text-base",
							onChange: (event) => onUpdate({ notes: event.target.value })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Segmented, {
						label: "الحالة",
						value: task.status,
						options: STATUSES.map((id) => ({
							id,
							label: STATUS_LABEL[id]
						})),
						onChange: onStatus
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Segmented, {
						label: "الأولوية",
						value: task.priority,
						options: PRIORITIES.map((id) => ({
							id,
							label: PRIORITY_LABEL[id]
						})),
						onChange: (priority) => onUpdate({ priority })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-2 flex items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "task-due",
							className: "text-sm font-medium text-muted",
							children: "الموعد"
						}), task.due ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "text-sm text-muted",
							onClick: () => onUpdate({ due: null }),
							children: "إزالة الموعد"
						}) : null]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "task-due",
						type: "date",
						value: task.due ?? "",
						className: controlClass,
						onChange: (event) => onUpdate({ due: event.target.value || null })
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mb-2 block text-sm font-medium text-muted",
							children: "القائمة"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: task.listId,
							className: controlClass,
							onChange: (event) => onUpdate({ listId: event.target.value }),
							children: lists.map((list) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: list.id,
								children: list.name
							}, list.id))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "danger",
						onClick: onDelete,
						children: "حذف المهمة"
					})
				]
			}) : null]
		})] })
	});
}
function ListPanel({ lists, tasks, listId, onSelect, onAdd, onRename, onRemove }) {
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [draft, setDraft] = (0, import_react.useState)("");
	const [creating, setCreating] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (editing && !lists.some((list) => list.id === editing)) setEditing(null);
	}, [editing, lists]);
	const totalOpen = tasks.filter((task) => task.status !== "done").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-0 flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-1 text-sm font-medium text-muted",
				children: "القوائم"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListButton, {
					active: listId === "all",
					label: "كل القوائم",
					count: totalOpen,
					onClick: () => onSelect("all")
				}), lists.map((list) => editing === list.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "flex flex-col gap-2 rounded-sm bg-canvas p-2",
					onSubmit: (event) => {
						event.preventDefault();
						onRename(list.id, draft);
						setEditing(null);
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							autoFocus: true,
							value: draft,
							maxLength: 40,
							"aria-label": "اسم القائمة",
							className: controlClass,
							onChange: (event) => setDraft(event.target.value),
							onKeyDown: (event) => {
								if (event.key === "Escape") setEditing(null);
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								size: "sm",
								className: "flex-1",
								children: "حفظ"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								size: "sm",
								variant: "ghost",
								onClick: () => setEditing(null),
								children: "إلغاء"
							})]
						}),
						lists.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "h-10 text-sm text-danger",
							onClick: () => onRemove(list.id),
							children: "حذف القائمة"
						}) : null
					]
				}, list.id) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListButton, {
						active: listId === list.id,
						label: list.name,
						count: openCount(tasks, list.id),
						onClick: () => onSelect(list.id)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "press grid size-11 shrink-0 place-items-center rounded-sm text-muted hover:bg-accent-soft",
						"aria-label": `تعديل ${list.name}`,
						onClick: () => {
							setEditing(list.id);
							setDraft(list.name);
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-4" })
					})]
				}, list.id))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-4 flex gap-2",
				onSubmit: (event) => {
					event.preventDefault();
					onAdd(creating);
					setCreating("");
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: creating,
					maxLength: 40,
					placeholder: "قائمة جديدة",
					"aria-label": "قائمة جديدة",
					className: controlClass,
					onChange: (event) => setCreating(event.target.value)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: !creating.trim(),
					children: "إضافة"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-faint",
				children: "تُحفظ مهامك على هذا الجهاز فقط."
			})
		]
	});
}
function ListButton({ active, label, count, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: cn("flex h-11 min-w-0 flex-1 items-center justify-between gap-3 rounded-sm px-3 text-start text-base", active ? "bg-accent text-accent-fg" : "hover:bg-accent-soft"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "truncate",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "tabular-nums",
			children: count
		})]
	});
}
function TaskRow({ task, listName, today, active, onOpen, onToggle }) {
	const done = task.status === "done";
	const overdue = bucketOf(task, today) === "overdue";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex items-start gap-2 border-b border-line py-2", active && "bg-accent-soft"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			role: "checkbox",
			"aria-checked": done,
			"aria-label": done ? `إعادة فتح: ${task.title}` : `إنجاز: ${task.title}`,
			onClick: onToggle,
			className: cn("press mt-1 grid size-11 shrink-0 place-items-center rounded-sm border", done ? "border-accent bg-accent text-accent-fg" : "border-faint bg-elevated text-transparent"),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
				className: "size-4",
				strokeWidth: 2.5
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: onOpen,
			className: "min-w-0 flex-1 py-2 text-start",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex items-start gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("mt-2 h-4 w-0.5 shrink-0 rounded-full", task.priority === "high" && !done ? "bg-ink" : "bg-transparent"),
					"aria-hidden": true
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("block text-base", done && "text-muted line-through"),
						children: task.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: listName }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn(overdue && "text-danger"),
								children: formatDue(task.due, today)
							}),
							task.priority === "high" && !done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-ink",
								children: "عالية"
							}) : null,
							task.status === "doing" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "قيد العمل" }) : null
						]
					})]
				})]
			})
		})]
	});
}
var useTasks = create()(persist((set) => ({
	lists: seedLists(),
	tasks: seedTasks(),
	addTask: (input) => {
		const title = input.title.trim();
		if (!title) return;
		const task = {
			id: uid("task"),
			title,
			notes: "",
			listId: input.listId,
			priority: input.priority,
			status: "open",
			due: input.due,
			createdAt: Date.now(),
			completedAt: null
		};
		set((state) => ({ tasks: [task, ...state.tasks] }));
	},
	updateTask: (id, patch) => set((state) => ({ tasks: state.tasks.map((task) => {
		if (task.id !== id) return task;
		const title = patch.title === void 0 ? task.title : patch.title.trim();
		if (!title) return task;
		return {
			...task,
			...patch,
			title,
			notes: patch.notes === void 0 ? task.notes : patch.notes.slice(0, 2e3)
		};
	}) })),
	setStatus: (id, status) => set((state) => ({ tasks: state.tasks.map((task) => {
		if (task.id !== id || task.status === status) return task;
		return {
			...task,
			status,
			completedAt: status === "done" ? Date.now() : null
		};
	}) })),
	toggleDone: (id) => set((state) => ({ tasks: state.tasks.map((task) => {
		if (task.id !== id) return task;
		if (task.status === "done") return {
			...task,
			status: "open",
			completedAt: null
		};
		return {
			...task,
			status: "done",
			completedAt: Date.now()
		};
	}) })),
	removeTask: (id) => set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) })),
	clearDone: (listId) => set((state) => ({ tasks: state.tasks.filter((task) => {
		if (task.status !== "done") return true;
		if (listId !== "all" && task.listId !== listId) return true;
		return false;
	}) })),
	addList: (name) => {
		const trimmed = name.trim().slice(0, 40);
		if (!trimmed) return;
		set((state) => ({ lists: [...state.lists, {
			id: uid("list"),
			name: trimmed
		}] }));
	},
	renameList: (id, name) => {
		const trimmed = name.trim().slice(0, 40);
		if (!trimmed) return;
		set((state) => ({ lists: state.lists.map((list) => list.id === id ? {
			...list,
			name: trimmed
		} : list) }));
	},
	removeList: (id) => set((state) => {
		if (state.lists.length <= 1) return state;
		const lists = state.lists.filter((list) => list.id !== id);
		const fallback = lists[0]?.id ?? "inbox";
		return {
			lists,
			tasks: state.tasks.map((task) => task.listId === id ? {
				...task,
				listId: fallback
			} : task)
		};
	})
}), {
	name: "mataabie-tasks-v1",
	skipHydration: true,
	partialize: (state) => ({
		lists: state.lists,
		tasks: state.tasks
	})
}));
function TaskTracker() {
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
	const [view, setView] = (0, import_react.useState)("today");
	const [listId, setListId] = (0, import_react.useState)("all");
	const [query, setQuery] = (0, import_react.useState)("");
	const [hideDone, setHideDone] = (0, import_react.useState)(false);
	const [selectedId, setSelectedId] = (0, import_react.useState)(null);
	const [manageOpen, setManageOpen] = (0, import_react.useState)(false);
	const [confirm, setConfirm] = (0, import_react.useState)(null);
	const [title, setTitle] = (0, import_react.useState)("");
	const [priority, setPriority] = (0, import_react.useState)("normal");
	const [due, setDue] = (0, import_react.useState)(() => todayISO());
	const [composeList, setComposeList] = (0, import_react.useState)("work");
	(0, import_react.useLayoutEffect)(() => {
		useTasks.persist.rehydrate();
	}, []);
	const today = todayISO();
	const heading = formatHeading();
	const filedList = lists.some((list) => list.id === (listId === "all" ? composeList : listId)) ? listId === "all" ? composeList : listId : lists[0]?.id ?? "inbox";
	const stats = (0, import_react.useMemo)(() => computeStats(tasks, listId, today), [
		tasks,
		listId,
		today
	]);
	const visible = (0, import_react.useMemo)(() => filterTasks(tasks, {
		view,
		listId,
		query,
		hideDone,
		today
	}), [
		tasks,
		view,
		listId,
		query,
		hideDone,
		today
	]);
	const groups = (0, import_react.useMemo)(() => groupByBucket(visible, today), [visible, today]);
	const selected = tasks.find((task) => task.id === selectedId) ?? null;
	const progress = stats.todayTotal === 0 ? 0 : Math.round(stats.todayDone / stats.todayTotal * 100);
	const hasDone = tasks.some((task) => task.status === "done" && (listId === "all" || task.listId === listId));
	const listName = (id) => lists.find((list) => list.id === id)?.name ?? "—";
	const confirmCopy = (() => {
		if (confirm?.type === "task") return {
			title: "حذف المهمة",
			body: `ستُحذف «${confirm.title}». لا يمكن التراجع.`,
			confirmLabel: "حذف"
		};
		if (confirm?.type === "list") return {
			title: "حذف القائمة",
			body: `ستُحذف «${confirm.name}» وتنتقل مهامها إلى قائمة أخرى.`,
			confirmLabel: "حذف القائمة"
		};
		if (confirm?.type === "clear-done") return {
			title: "مسح المنجز",
			body: "ستُحذف المهام المنجزة في هذا النطاق. لا يمكن التراجع.",
			confirmLabel: "مسح"
		};
		return null;
	})();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-canvas text-ink lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
				className: "sticky top-0 hidden h-dvh flex-col border-e border-line bg-surface px-4 py-6 lg:flex",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListPanel, {
					lists,
					tasks,
					listId,
					onSelect: setListId,
					onAdd: addList,
					onRename: renameList,
					onRemove: (id) => {
						const list = lists.find((item) => item.id === id);
						if (list) setConfirm({
							type: "list",
							id,
							name: list.name
						});
					}
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: cn("me-auto w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-8", view === "board" ? "max-w-6xl" : "max-w-3xl"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: heading
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-1 text-3xl font-medium tracking-tight",
							children: "متتبع المهام"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative sm:w-72",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-faint" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: query,
									onChange: (event) => setQuery(event.target.value),
									placeholder: "ابحث في المهام",
									"aria-label": "ابحث في المهام",
									className: cn(controlClass, "bg-elevated ps-10 pe-12")
								}),
								query ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": "مسح البحث",
									className: "absolute end-0 top-0 grid size-11 place-items-center text-muted",
									onClick: () => setQuery(""),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
								}) : null
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						"aria-label": "ملخص",
						className: "mt-6 overflow-hidden rounded-xl border border-line bg-line",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "grid grid-cols-2 gap-px sm:grid-cols-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
									label: "مفتوحة",
									value: stats.open
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
									label: "مستحقة اليوم",
									value: stats.dueToday
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
									label: "متأخرة",
									value: stats.overdue,
									tone: stats.overdue > 0 ? "danger" : "ink"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
									label: "منجزة اليوم",
									value: stats.doneToday,
									tone: stats.doneToday > 0 ? "done" : "ink"
								})
							]
						})
					}),
					stats.todayTotal > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-2 flex items-center justify-between text-sm text-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "إنجاز مواعيد اليوم" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "tabular-nums",
								children: [
									stats.todayDone,
									" / ",
									stats.todayTotal
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-1 overflow-hidden rounded-full bg-line",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "motion-width h-full rounded-full bg-accent",
								style: { width: `${progress}%` }
							})
						})]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 flex gap-2 overflow-x-auto lg:hidden",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
								active: listId === "all",
								onClick: () => setListId("all"),
								children: "الكل"
							}),
							lists.map((list) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
								active: listId === list.id,
								onClick: () => setListId(list.id),
								children: list.name
							}, list.id)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
								active: false,
								onClick: () => setManageOpen(true),
								children: "إدارة"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex rounded-sm border border-line bg-elevated p-1",
							role: "tablist",
							"aria-label": "طريقة العرض",
							children: Object.keys(VIEW_LABEL).map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								role: "tab",
								"aria-selected": view === id,
								onClick: () => setView(id),
								className: cn("press h-10 flex-1 rounded-xs px-3 text-sm font-medium sm:flex-none", view === id ? "bg-accent text-accent-fg" : "text-muted"),
								children: VIEW_LABEL[id]
							}, id))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [view !== "today" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: hideDone ? "primary" : "ghost",
								size: "sm",
								"aria-pressed": hideDone,
								onClick: () => setHideDone((value) => !value),
								children: hideDone ? "إظهار المنجز" : "إخفاء المنجز"
							}) : null, hasDone ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "sm",
								onClick: () => setConfirm({ type: "clear-done" }),
								children: "مسح المنجز"
							}) : null]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mt-5 rounded-xl border border-line bg-elevated p-4",
						onSubmit: (event) => {
							event.preventDefault();
							const nextTitle = title.trim();
							if (!nextTitle) return;
							addTask({
								title: nextTitle,
								listId: filedList,
								priority,
								due: due || null
							});
							setTitle("");
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								htmlFor: "new-task",
								className: "sr-only",
								children: "مهمة جديدة"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "new-task",
								value: title,
								maxLength: 160,
								placeholder: "ما الذي تريد إنجازه؟",
								className: "h-11 w-full bg-transparent text-base outline-none placeholder:text-faint",
								onChange: (event) => setTitle(event.target.value)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										"aria-label": "قائمة المهمة",
										value: filedList,
										className: cn(controlClass, "bg-canvas sm:w-auto"),
										onChange: (event) => {
											const next = event.target.value;
											if (listId === "all") setComposeList(next);
											else setListId(next);
										},
										children: lists.map((list) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: list.id,
											children: list.name
										}, list.id))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "date",
										"aria-label": "موعد المهمة",
										value: due,
										className: cn(controlClass, "bg-canvas sm:w-auto"),
										onChange: (event) => setDue(event.target.value)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										"aria-label": "أولوية المهمة",
										value: priority,
										className: cn(controlClass, "bg-canvas sm:w-auto"),
										onChange: (event) => setPriority(event.target.value),
										children: PRIORITIES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
											value: item,
											children: ["أولوية ", PRIORITY_LABEL[item]]
										}, item))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "submit",
										disabled: !title.trim(),
										className: "sm:ms-auto",
										children: "إضافة"
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6",
						children: view === "board" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Board, {
							tasks: visible,
							today,
							listName,
							onOpen: setSelectedId,
							onToggle: toggleDone,
							onStatus: setStatus
						}) : visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
							view,
							query
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: groups.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "mb-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								"aria-label": `${BUCKET_LABEL[group.bucket]} ${group.tasks.length}`,
								className: cn("mb-1 text-sm font-medium", group.bucket === "overdue" ? "text-danger" : "text-muted"),
								children: [BUCKET_LABEL[group.bucket], /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ms-2 tabular-nums",
									children: group.tasks.length
								})]
							}), group.tasks.map((task) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskRow, {
								task,
								today,
								listName: listName(task.listId),
								active: task.id === selectedId,
								onOpen: () => setSelectedId(task.id),
								onToggle: () => toggleDone(task.id)
							}, task.id))]
						}, group.bucket)) })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: manageOpen,
				onOpenChange: setManageOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "modal-overlay fixed inset-0 z-40 bg-ink/35" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "center-pop max-h-[80dvh] overflow-y-auto rounded-xl border border-line bg-surface p-5 outline-none",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-4 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
								className: "text-xl font-medium",
								children: "القوائم"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogClose, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "quiet",
									size: "icon",
									"aria-label": "إغلاق",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
							className: "sr-only",
							children: "أضف قائمة أو عدّل أسماء القوائم."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListPanel, {
							lists,
							tasks,
							listId,
							onSelect: (id) => {
								setListId(id);
								setManageOpen(false);
							},
							onAdd: addList,
							onRename: renameList,
							onRemove: (id) => {
								const list = lists.find((item) => item.id === id);
								if (list) setConfirm({
									type: "list",
									id,
									name: list.name
								});
							}
						})
					]
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailDialog, {
				task: selected,
				lists,
				onClose: () => setSelectedId(null),
				onUpdate: (patch) => {
					if (selected) updateTask(selected.id, patch);
				},
				onStatus: (status) => {
					if (selected) setStatus(selected.id, status);
				},
				onDelete: () => {
					if (selected) setConfirm({
						type: "task",
						id: selected.id,
						title: selected.title
					});
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDialog, {
				open: confirm != null,
				title: confirmCopy?.title ?? "",
				body: confirmCopy?.body ?? "",
				confirmLabel: confirmCopy?.confirmLabel ?? "تأكيد",
				onOpenChange: (open) => {
					if (!open) setConfirm(null);
				},
				onConfirm: () => {
					if (confirm?.type === "task") {
						removeTask(confirm.id);
						setSelectedId((current) => current === confirm.id ? null : current);
					} else if (confirm?.type === "list") {
						removeList(confirm.id);
						setListId((current) => current === confirm.id ? "all" : current);
					} else if (confirm?.type === "clear-done") clearDone(listId);
					setConfirm(null);
				}
			})
		]
	});
}
function Stat({ label, value, tone = "ink" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-surface px-4 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-sm text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: cn("mt-1 text-2xl font-medium tabular-nums tracking-tight", tone === "danger" && "text-danger", tone === "done" && "text-done"),
			children: value
		})]
	});
}
function Chip({ active, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: cn("press h-11 shrink-0 rounded-full border px-4 text-sm font-medium", active ? "border-ink bg-accent text-accent-fg" : "border-line bg-elevated text-ink"),
		children
	});
}
function Empty({ view, query }) {
	const searching = query.trim().length > 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-line px-6 py-12 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-base font-medium",
			children: searching ? "لا نتائج" : view === "today" ? "لا مهام مستحقة اليوم" : "لا مهام"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted",
			children: searching ? "لا توجد مهمة تطابق البحث." : view === "today" ? "المتأخر وما يحل موعده اليوم يظهر هنا." : "أضف مهمة جديدة من الحقل أعلاه."
		})]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskTracker, {});
}
//#endregion
export { Home as component };
