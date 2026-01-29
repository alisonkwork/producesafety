import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ChecklistStore,
  Task,
  TaskCategory,
  TaskFrequency,
  TaskStatus,
  CHECKLIST_STORAGE_KEY,
  computeNextDueDate,
  loadChecklistStore,
  saveChecklistStore,
} from "@/lib/fsma-checklist";
import { addDays, isWithinInterval, startOfMonth, endOfMonth } from "date-fns";

function updateTask(store: ChecklistStore, taskId: string, updater: (task: Task) => Task) {
  return {
    ...store,
    tasks: store.tasks.map((task) => (task.id === taskId ? updater(task) : task)),
  };
}

export function useChecklistStore() {
  const [store, setStore] = useState<ChecklistStore | null>(null);

  useEffect(() => {
    const now = new Date();
    setStore(loadChecklistStore(now));
  }, []);

  const saveStore = useCallback((next: ChecklistStore) => {
    saveChecklistStore(next);
    setStore(next);
  }, []);

  const setTaskStatus = useCallback(
    (taskId: string, status: TaskStatus) => {
      if (!store) return;
      const now = new Date();
      const next = updateTask(store, taskId, (task) => ({
        ...task,
        status,
        updatedAt: now.toISOString(),
      }));
      saveStore(next);
    },
    [store, saveStore]
  );

  const updateNotes = useCallback(
    (taskId: string, notes: string) => {
      if (!store) return;
      const now = new Date();
      const next = updateTask(store, taskId, (task) => ({
        ...task,
        notes,
        updatedAt: now.toISOString(),
      }));
      saveStore(next);
    },
    [store, saveStore]
  );

  const updateTaskFields = useCallback(
    (taskId: string, updates: Partial<Pick<Task, "title" | "description" | "category" | "frequency">>) => {
      if (!store) return;
      const now = new Date();
      const next = updateTask(store, taskId, (task) => ({
        ...task,
        ...updates,
        updatedAt: now.toISOString(),
      }));
      saveStore(next);
    },
    [store, saveStore]
  );

  const addTask = useCallback(
    (input: {
      title: string;
      description: string;
      category: TaskCategory;
      frequency: TaskFrequency;
      notes?: string;
    }) => {
      if (!store) return;
      const nowIso = new Date().toISOString();
      const newTask: Task = {
        id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `task-${Date.now()}`,
        title: input.title,
        description: input.description,
        category: input.category,
        frequency: input.frequency,
        status: "not_started",
        evidenceRequired: false,
        lastCompletedAt: null,
        lastReviewedAt: null,
        nextDueDate: null,
        notes: input.notes ?? "",
        createdAt: nowIso,
        updatedAt: nowIso,
      };
      saveStore({ ...store, tasks: [...store.tasks, newTask] });
    },
    [store, saveStore]
  );

  const completeTask = useCallback(
    (taskId: string) => {
      if (!store) return;
      const now = new Date();
      const nowIso = now.toISOString();
      const next = updateTask(store, taskId, (task) => {
        const nextDueDate = computeNextDueDate(task.frequency, now);
        return {
          ...task,
          status: "done",
          lastCompletedAt: nowIso,
          lastReviewedAt: task.frequency === "ongoing" ? nowIso : task.lastReviewedAt,
          nextDueDate,
          updatedAt: nowIso,
        };
      });
      const history = { ...next.completionHistory };
      const existing = history[taskId] ?? [];
      history[taskId] = [...existing, nowIso];
      saveStore({ ...next, completionHistory: history });
    },
    [store, saveStore]
  );

  const uncompleteTask = useCallback(
    (taskId: string) => {
      if (!store) return;
      const nowIso = new Date().toISOString();
      const next = updateTask(store, taskId, (task) => ({
        ...task,
        status: "not_started",
        lastCompletedAt: null,
        lastReviewedAt: task.frequency === "ongoing" ? null : task.lastReviewedAt,
        nextDueDate: null,
        updatedAt: nowIso,
      }));
      saveStore(next);
    },
    [store, saveStore]
  );

  const deleteTask = useCallback(
    (taskId: string) => {
      if (!store) return;
      const next = {
        ...store,
        tasks: store.tasks.filter((task) => task.id !== taskId),
      };
      const history = { ...next.completionHistory };
      delete history[taskId];
      saveStore({ ...next, completionHistory: history });
    },
    [store, saveStore]
  );

  const resetStore = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(CHECKLIST_STORAGE_KEY);
    }
    const next = loadChecklistStore(new Date());
    saveStore(next);
  }, [saveStore]);

  const tasks = useMemo(() => store?.tasks ?? [], [store]);
  const completionHistory = useMemo(() => store?.completionHistory ?? {}, [store]);

  const summary = useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    const dueSoonCutoff = addDays(now, 14);

    const overdueCount = tasks.filter(
      (task) =>
        task.status !== "done" &&
        task.nextDueDate &&
        new Date(task.nextDueDate) < now
    ).length;

    const dueSoonCount = tasks.filter(
      (task) =>
        task.status !== "done" &&
        task.nextDueDate &&
        new Date(task.nextDueDate) >= now &&
        new Date(task.nextDueDate) <= dueSoonCutoff
    ).length;

    const completedThisMonth = Object.values(completionHistory).reduce((count, dates) => {
      const monthMatches = dates.filter((dateIso) =>
        isWithinInterval(new Date(dateIso), { start: monthStart, end: monthEnd })
      ).length;
      return count + monthMatches;
    }, 0);

    const progressByCategory = tasks.reduce<Record<string, { done: number; total: number }>>(
      (acc, task) => {
        acc[task.category] = acc[task.category] ?? { done: 0, total: 0 };
        acc[task.category].total += 1;
        if (task.status === "done") acc[task.category].done += 1;
        return acc;
      },
      {}
    );

    return {
      overdueCount,
      dueSoonCount,
      completedThisMonth,
      progressByCategory,
    };
  }, [tasks, completionHistory]);

  return {
    store,
    tasks,
    completionHistory,
    setTaskStatus,
    updateNotes,
    updateTaskFields,
    addTask,
    completeTask,
    uncompleteTask,
    deleteTask,
    resetStore,
    summary,
  };
}
