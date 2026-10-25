import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  seedLists,
  seedTasks,
  uid,
  type Priority,
  type Status,
  type Task,
  type TaskList,
} from "@/lib/tasks/model";

export interface TaskPatch {
  title?: string;
  notes?: string;
  listId?: string;
  priority?: Priority;
  due?: string | null;
}

interface TaskState {
  lists: TaskList[];
  tasks: Task[];
  addTask: (input: { title: string; listId: string; priority: Priority; due: string | null }) => void;
  updateTask: (id: string, patch: TaskPatch) => void;
  setStatus: (id: string, status: Status) => void;
  toggleDone: (id: string) => void;
  removeTask: (id: string) => void;
  clearDone: (listId: string) => void;
  addList: (name: string) => void;
  renameList: (id: string, name: string) => void;
  removeList: (id: string) => void;
}

export const useTasks = create<TaskState>()(
  persist(
    (set) => ({
      lists: seedLists(),
      tasks: seedTasks(),
      addTask: (input) => {
        const title = input.title.trim();
        if (!title) return;
        const task: Task = {
          id: uid("task"),
          title,
          notes: "",
          listId: input.listId,
          priority: input.priority,
          status: "open",
          due: input.due,
          createdAt: Date.now(),
          completedAt: null,
        };
        set((state) => ({ tasks: [task, ...state.tasks] }));
      },
      updateTask: (id, patch) =>
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id !== id) return task;
            const title = patch.title === undefined ? task.title : patch.title.trim();
            if (!title) return task;
            return {
              ...task,
              ...patch,
              title,
              notes: patch.notes === undefined ? task.notes : patch.notes.slice(0, 2000),
            };
          }),
        })),
      setStatus: (id, status) =>
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id !== id || task.status === status) return task;
            return {
              ...task,
              status,
              completedAt: status === "done" ? Date.now() : null,
            };
          }),
        })),
      toggleDone: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id !== id) return task;
            if (task.status === "done") return { ...task, status: "open", completedAt: null };
            return { ...task, status: "done", completedAt: Date.now() };
          }),
        })),
      removeTask: (id) => set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) })),
      clearDone: (listId) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => {
            if (task.status !== "done") return true;
            if (listId !== "all" && task.listId !== listId) return true;
            return false;
          }),
        })),
      addList: (name) => {
        const trimmed = name.trim().slice(0, 40);
        if (!trimmed) return;
        set((state) => ({ lists: [...state.lists, { id: uid("list"), name: trimmed }] }));
      },
      renameList: (id, name) => {
        const trimmed = name.trim().slice(0, 40);
        if (!trimmed) return;
        set((state) => ({
          lists: state.lists.map((list) => (list.id === id ? { ...list, name: trimmed } : list)),
        }));
      },
      removeList: (id) =>
        set((state) => {
          if (state.lists.length <= 1) return state;
          const lists = state.lists.filter((list) => list.id !== id);
          const fallback = lists[0]?.id ?? "inbox";
          return {
            lists,
            tasks: state.tasks.map((task) =>
              task.listId === id ? { ...task, listId: fallback } : task,
            ),
          };
        }),
    }),
    {
      name: "mataabie-tasks-v1",
      skipHydration: true,
      partialize: (state) => ({ lists: state.lists, tasks: state.tasks }),
    },
  ),
);
