import { addDays, addMonths, addYears, isBefore, startOfDay } from "date-fns";

export type TaskFrequency = "one-time" | "annual" | "monthly" | "weekly" | "per-event" | "ongoing";
export type TaskStatus = "not_started" | "in_progress" | "done" | "overdue";

export type TaskCategory =
  | "Worker Training & Hygiene"
  | "Agricultural Water"
  | "Soil Amendments"
  | "Wildlife & Pre-harvest Assessments"
  | "Postharvest Handling & Sanitation"
  | "Records & Documentation";

export interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  frequency: TaskFrequency;
  status: TaskStatus;
  evidenceRequired?: boolean;
  lastCompletedAt: string | null;
  lastReviewedAt: string | null;
  nextDueDate: string | null;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChecklistStore {
  version: 1;
  tasks: Task[];
  completionHistory: Record<string, string[]>;
}

export const CHECKLIST_STORAGE_KEY = "fsmaChecklistStore_v1";

const CATEGORY_ORDER: TaskCategory[] = [
  "Worker Training & Hygiene",
  "Agricultural Water",
  "Soil Amendments",
  "Wildlife & Pre-harvest Assessments",
  "Postharvest Handling & Sanitation",
  "Records & Documentation",
];

export function getCategoryOrder() {
  return CATEGORY_ORDER;
}

export function computeNextDueDate(frequency: TaskFrequency, fromDate: Date) {
  if (frequency === "annual") return addYears(fromDate, 1).toISOString();
  if (frequency === "monthly") return addMonths(fromDate, 1).toISOString();
  if (frequency === "weekly") return addDays(fromDate, 7).toISOString();
  return null;
}

export function refreshOverdueTasks(tasks: Task[], now: Date) {
  const today = startOfDay(now);
  return tasks.map((task) => {
    if (task.status === "done") return task;
    if (!task.nextDueDate) return task;
    const due = startOfDay(new Date(task.nextDueDate));
    if (isBefore(due, today)) {
      return { ...task, status: "overdue", updatedAt: now.toISOString() };
    }
    return task;
  });
}

export function seedTasks(now: Date): Task[] {
  const nowIso = now.toISOString();
  const seedData = [
    {
      id: "wth-001",
      title: "Train workers on produce safety",
      description:
        "All workers that handle or contact covered produce or supervise covered activities must be trained on produce safety at least once annually.",
      category: "Worker Training & Hygiene",
      frequency: "annual",
      status: "not_started",
      evidenceRequired: false,
      lastCompletedAt: null,
      nextDueDate: null,
      notes: "",
    },
    {
      id: "wth-002",
      title: "Attend a Produce Safety Alliance Grower Training",
      description:
        "§112.22(c) requires that at least one supervisor from the farm complete food safety training at least equivalent to the standardized curriculum recognized by the FDA.",
      category: "Worker Training & Hygiene",
      frequency: "one-time",
      status: "not_started",
      evidenceRequired: false,
      lastCompletedAt: null,
      nextDueDate: null,
      notes: "",
    },

    {
      id: "wth-004",
      title: "Check toilets & handwashing stations are accessible and stocked",
      description:
        "Confirm toilet facilities and handwashing stations are readily accessible and sufficiently close, stocked, and functional.",
      category: "Worker Training & Hygiene",
      frequency: "weekly",
      status: "not_started",
      evidenceRequired: false,
      lastCompletedAt: null,
      nextDueDate: null,
      notes: "",
    },
   

  
  
   
    {
      id: "wat-005",
      title: "Conduct an agricultural water assessment",
      description:
        "The agricultural water assessment must be completed at least once per year, to identify conditions that may result in contamination of the water source or otherwise increase the likelihood of human pathogens being in the water. ",
      category: "Agricultural Water",
      frequency: "annual",
      status: "not_started",
      evidenceRequired: false,
      lastCompletedAt: null,
      nextDueDate: null,
      notes: "",
    },
   
  
    {
      id: "soil-002",
      title: "Verify BSAAO meets microbial standards or is treated",
      description:
        "Confirm biological soil amendments of animal origin meet applicable microbial standards or are treated; otherwise consider them untreated.",
      category: "Soil Amendments",
      frequency: "per-event",
      status: "not_started",
      evidenceRequired: false,
      lastCompletedAt: null,
      nextDueDate: null,
      notes: "Trigger: New soil amendment source/batch",
    },
    {
      id: "soil-003",
      title: "Use a scientifically valid composting process",
      description:
        "If composting BSAAO, use a scientifically valid controlled process (e.g., time/temperature/turning standards).",
      category: "Soil Amendments",
      frequency: "ongoing",
      status: "not_started",
      evidenceRequired: false,
      lastCompletedAt: null,
      nextDueDate: null,
      notes: "",
    },

    {
      id: "wild-001",
      title: "Monitor wildlife activity during the growing season",
      description:
        "Monitor fields for feces and evidence of animal intrusion during the growing season and evaluate contamination risk.",
      category: "Wildlife & Pre-harvest Assessments",
      frequency: "weekly",
      status: "not_started",
      evidenceRequired: false,
      lastCompletedAt: null,
      nextDueDate: null,
      notes: "",
    },
    {
      id: "wild-002",
      title: "Conduct a pre-harvest risk assessment (immediately prior to harvest)",
      description:
        "Inspect for fecal contamination and signs of animal activity (tracks, trampling, rooting) and decide what can be safely harvested.",
      category: "Wildlife & Pre-harvest Assessments",
      frequency: "per-event",
      status: "not_started",
      evidenceRequired: false,
      lastCompletedAt: null,
      nextDueDate: null,
      notes: "Trigger: Before each harvest in a field/block",
    },

    {
      id: "post-004",
      title: "Monitor for pests in the wash pack",
      description:
        "There must be routine monitoring for pests (§112.128).",
      category: "Postharvest Handling & Sanitation",
      frequency: "monthly",
      status: "not_started",
      evidenceRequired: false,
      lastCompletedAt: null,
      nextDueDate: null,
      notes: "",
    },

    {
      id: "post-005",
      title: "Inspect harvest containers and equipment for damage or replacement needs",
      description:
        "All equipment and tools must be of adequate design, construction, and workmanship to enable them to be adequately cleaned and properly maintained (§112.123(a)).",
      category: "Postharvest Handling & Sanitation",
      frequency: "annual",
      status: "not_started",
      evidenceRequired: false,
      lastCompletedAt: null,
      nextDueDate: null,
      notes: "",
    },
    
    {
      id: "rec-001",
      title: "Make sure food safety plan is up to date",
      description:
        "Look over your food safety plan to ensure it reflects practices and procedures you are currently doing on your farm.",
      category: "Records & Documentation",
      frequency: "annual",
      status: "not_started",
      evidenceRequired: false,
      lastCompletedAt: null,
      nextDueDate: null,
      notes: "Do not enter sensitive details",
    },
  
   
  ] as const;

  return seedData.map((task) => ({
    ...task,
    lastReviewedAt: null,
    createdAt: nowIso,
    updatedAt: nowIso,
  }));
}

export function loadChecklistStore(now: Date): ChecklistStore {
  if (typeof window === "undefined") {
    return { version: 1, tasks: seedTasks(now), completionHistory: {} };
  }

  const raw = localStorage.getItem(CHECKLIST_STORAGE_KEY);
  if (!raw) {
    const seeded = { version: 1 as const, tasks: seedTasks(now), completionHistory: {} };
    localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }

  try {
    const parsed = JSON.parse(raw) as ChecklistStore;
    if (!parsed || parsed.version !== 1 || !Array.isArray(parsed.tasks)) {
      throw new Error("Invalid store");
    }
    const filteredTasks = parsed.tasks.filter((task) => task.id !== "wth-003");
    if (filteredTasks.length !== parsed.tasks.length) {
      delete parsed.completionHistory["wth-003"];
    }
    const refreshed = {
      ...parsed,
      tasks: refreshOverdueTasks(filteredTasks, now),
    };
    localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(refreshed));
    return refreshed;
  } catch {
    const seeded = { version: 1 as const, tasks: seedTasks(now), completionHistory: {} };
    localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }
}

export function saveChecklistStore(store: ChecklistStore) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(store));
}
