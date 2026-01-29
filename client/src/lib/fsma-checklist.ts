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
      title: "Train workers on produce safety & hygiene",
      description:
        "Train all personnel who handle covered produce or food-contact surfaces on food safety, hygiene, and contamination prevention.",
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
      title: "Train new workers before they start covered activities",
      description:
        "Provide required training to new workers before they handle covered produce or food-contact surfaces.",
      category: "Worker Training & Hygiene",
      frequency: "per-event",
      status: "not_started",
      evidenceRequired: false,
      lastCompletedAt: null,
      nextDueDate: null,
      notes: "Trigger: New hire / role change",
    },
    {
      id: "wth-003",
      title: "Review handwashing moments with crew",
      description:
        "Review when workers must wash hands (after toilet use, before returning to work, after animals/manure, before gloves, etc.).",
      category: "Worker Training & Hygiene",
      frequency: "monthly",
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
      id: "wth-005",
      title: "Visitor food-safety briefing is in place",
      description:
        "Make visitors aware of farm food safety policies and where to find toilets and handwashing stations.",
      category: "Worker Training & Hygiene",
      frequency: "ongoing",
      status: "not_started",
      evidenceRequired: false,
      lastCompletedAt: null,
      nextDueDate: null,
      notes: "Examples: signage, short policy summary, verbal briefing",
    },
    {
      id: "wth-006",
      title: "Sick worker exclusion reminder",
      description:
        "Remind workers to report illness and prevent sick personnel from contacting covered produce.",
      category: "Worker Training & Hygiene",
      frequency: "monthly",
      status: "not_started",
      evidenceRequired: false,
      lastCompletedAt: null,
      nextDueDate: null,
      notes: "",
    },
    {
      id: "wth-007",
      title: "Glove condition check",
      description:
        "If gloves are used, ensure they are sanitary and intact when handling covered produce or food-contact surfaces.",
      category: "Worker Training & Hygiene",
      frequency: "weekly",
      status: "not_started",
      evidenceRequired: false,
      lastCompletedAt: null,
      nextDueDate: null,
      notes: "",
    },
    {
      id: "wat-001",
      title: "Inspect agricultural water systems for hazards",
      description:
        "Inspect water sources and distribution systems under your control for produce safety hazards (source type, protection, nearby land use, etc.).",
      category: "Agricultural Water",
      frequency: "annual",
      status: "not_started",
      evidenceRequired: false,
      lastCompletedAt: null,
      nextDueDate: null,
      notes: "",
    },
    {
      id: "wat-002",
      title: "Confirm all agricultural water is safe for intended use",
      description:
        "Verify agricultural water is safe and of adequate sanitary quality for its intended use.",
      category: "Agricultural Water",
      frequency: "ongoing",
      status: "not_started",
      evidenceRequired: false,
      lastCompletedAt: null,
      nextDueDate: null,
      notes: "",
    },
    {
      id: "wat-003",
      title: "Establish/update MWQP for untreated sources used for direct application",
      description:
        "Create or update the microbial water quality profile (MWQP) for untreated surface/ground water applied directly during growing.",
      category: "Agricultural Water",
      frequency: "annual",
      status: "not_started",
      evidenceRequired: false,
      lastCompletedAt: null,
      nextDueDate: null,
      notes: "Only if using untreated sources for direct application",
    },
    {
      id: "wat-004",
      title: "Well water testing schedule (initial profile)",
      description:
        "For postharvest uses with well water: test 4+ times initially to establish a water quality profile.",
      category: "Agricultural Water",
      frequency: "one-time",
      status: "not_started",
      evidenceRequired: false,
      lastCompletedAt: null,
      nextDueDate: null,
      notes: "Only if using well water for postharvest uses",
    },
    {
      id: "wat-005",
      title: "Well water annual test (subsequent years)",
      description:
        "After initial profile: test well water at least 1 time each subsequent year during growing season for applicable uses.",
      category: "Agricultural Water",
      frequency: "annual",
      status: "not_started",
      evidenceRequired: false,
      lastCompletedAt: null,
      nextDueDate: null,
      notes: "Only if using well water for applicable uses",
    },
    {
      id: "wat-006",
      title: "Obtain municipal water documentation (if applicable)",
      description:
        "If using public supply water, obtain annual documentation or test results from the municipality for recordkeeping.",
      category: "Agricultural Water",
      frequency: "annual",
      status: "not_started",
      evidenceRequired: false,
      lastCompletedAt: null,
      nextDueDate: null,
      notes: "Only if using municipal/public water",
    },
    {
      id: "wat-007",
      title: "Postharvest water: confirm E. coli not detectable for key uses",
      description:
        "For water used for direct contact with produce, food-contact surfaces, ice, or handwashing: ensure no detectable generic E. coli per 100 mL.",
      category: "Agricultural Water",
      frequency: "weekly",
      status: "not_started",
      evidenceRequired: false,
      lastCompletedAt: null,
      nextDueDate: null,
      notes: "",
    },
    {
      id: "wat-008",
      title: "Do not use untreated surface water for postharvest activities",
      description:
        "Confirm untreated surface water is not used for postharvest washing/cooling/handling activities.",
      category: "Agricultural Water",
      frequency: "ongoing",
      status: "not_started",
      evidenceRequired: false,
      lastCompletedAt: null,
      nextDueDate: null,
      notes: "",
    },
    {
      id: "wat-009",
      title: "Monitor wash/cooling water for organic buildup",
      description:
        "Visually monitor water used during harvest, packing, and holding for buildup of organic material and manage as needed.",
      category: "Agricultural Water",
      frequency: "weekly",
      status: "not_started",
      evidenceRequired: false,
      lastCompletedAt: null,
      nextDueDate: null,
      notes: "",
    },
    {
      id: "wat-010",
      title: "Update water change schedule for postharvest systems",
      description:
        "Maintain and adjust water-changing schedules based on organic load, turbidity, produce volume/type, flow, sanitizer, and equipment.",
      category: "Agricultural Water",
      frequency: "monthly",
      status: "not_started",
      evidenceRequired: false,
      lastCompletedAt: null,
      nextDueDate: null,
      notes: "",
    },
    {
      id: "wat-011",
      title: "Verify antimicrobial products are labeled for produce",
      description:
        "Confirm any antimicrobial used in postharvest water is labeled for use with fruits and vegetables and used only as labeled.",
      category: "Agricultural Water",
      frequency: "per-event",
      status: "not_started",
      evidenceRequired: false,
      lastCompletedAt: null,
      nextDueDate: null,
      notes: "Trigger: New sanitizer/antimicrobial product",
    },
    {
      id: "wat-012",
      title: "Use only approved food-grade pH modifiers (if adjusting pH)",
      description:
        "If modifying pH in wash systems, use approved food-grade products (e.g., citric or acetic acid).",
      category: "Agricultural Water",
      frequency: "ongoing",
      status: "not_started",
      evidenceRequired: false,
      lastCompletedAt: null,
      nextDueDate: null,
      notes: "",
    },
    {
      id: "wat-013",
      title: "Maintain appropriate water temperature in postharvest operations",
      description:
        "Monitor and maintain water temperature appropriate for the commodity and operation.",
      category: "Agricultural Water",
      frequency: "weekly",
      status: "not_started",
      evidenceRequired: false,
      lastCompletedAt: null,
      nextDueDate: null,
      notes: "",
    },
    {
      id: "wat-014",
      title: "Dispose of wastewater to prevent contamination",
      description:
        "Dispose of produce wash/cooling wastewater so it does not contaminate covered produce or growing areas.",
      category: "Agricultural Water",
      frequency: "monthly",
      status: "not_started",
      evidenceRequired: false,
      lastCompletedAt: null,
      nextDueDate: null,
      notes: "",
    },
    {
      id: "soil-001",
      title: "Do not use untreated human waste",
      description: "Ensure untreated human waste is not used as a soil amendment.",
      category: "Soil Amendments",
      frequency: "ongoing",
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
      id: "soil-004",
      title: "Renew soil amendment supplier documentation",
      description: "Collect supplier documentation for soil amendments and renew at least annually.",
      category: "Soil Amendments",
      frequency: "annual",
      status: "not_started",
      evidenceRequired: false,
      lastCompletedAt: null,
      nextDueDate: null,
      notes: "",
    },
    {
      id: "soil-005",
      title: "Confirm process controls were achieved (time/temp/turning)",
      description:
        "Verify compost process controls (time, temperature, turning) were achieved for the composting method used.",
      category: "Soil Amendments",
      frequency: "per-event",
      status: "not_started",
      evidenceRequired: false,
      lastCompletedAt: null,
      nextDueDate: null,
      notes: "Trigger: Each compost batch (self-produced)",
    },
    {
      id: "soil-006",
      title: "Follow raw manure timing intervals (NOP guidance)",
      description:
        "If using raw manure, follow timing intervals before harvest (e.g., 90/120 days depending on crop contact).",
      category: "Soil Amendments",
      frequency: "per-event",
      status: "not_started",
      evidenceRequired: false,
      lastCompletedAt: null,
      nextDueDate: null,
      notes: "Trigger: Raw manure application",
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
      title: "Pre-harvest field assessment (immediately prior to harvest)",
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
      id: "wild-003",
      title: "Do not harvest produce visibly contaminated with feces",
      description:
        "Ensure workers do not harvest covered produce that is visibly contaminated with animal excreta.",
      category: "Wildlife & Pre-harvest Assessments",
      frequency: "ongoing",
      status: "not_started",
      evidenceRequired: false,
      lastCompletedAt: null,
      nextDueDate: null,
      notes: "",
    },
    {
      id: "wild-004",
      title: "Exclude animals from fully enclosed produce-handling buildings",
      description:
        "Exclude or separate animals (including pets) from areas where covered produce activities occur in fully enclosed buildings.",
      category: "Wildlife & Pre-harvest Assessments",
      frequency: "ongoing",
      status: "not_started",
      evidenceRequired: false,
      lastCompletedAt: null,
      nextDueDate: null,
      notes: "",
    },
    {
      id: "wild-005",
      title: "Maintain sewage/septic systems to prevent contamination",
      description:
        "Ensure sewage and septic systems are maintained to prevent contamination of produce and food-contact surfaces.",
      category: "Wildlife & Pre-harvest Assessments",
      frequency: "annual",
      status: "not_started",
      evidenceRequired: false,
      lastCompletedAt: null,
      nextDueDate: null,
      notes: "",
    },
    {
      id: "wild-006",
      title: "Train workers on contamination risks related to wildlife/animals",
      description:
        "Train workers to recognize contamination risks, avoid harvesting contaminated produce, and wash hands after handling feces/animals.",
      category: "Wildlife & Pre-harvest Assessments",
      frequency: "annual",
      status: "not_started",
      evidenceRequired: false,
      lastCompletedAt: null,
      nextDueDate: null,
      notes: "",
    },
    {
      id: "post-001",
      title: "Do not harvest produce contaminated with feces",
      description: "Workers must never harvest covered produce contaminated with feces.",
      category: "Postharvest Handling & Sanitation",
      frequency: "ongoing",
      status: "not_started",
      evidenceRequired: false,
      lastCompletedAt: null,
      nextDueDate: null,
      notes: "",
    },
    {
      id: "post-002",
      title: "Do not harvest or distribute dropped produce",
      description: "Workers must never harvest or distribute dropped covered produce.",
      category: "Postharvest Handling & Sanitation",
      frequency: "ongoing",
      status: "not_started",
      evidenceRequired: false,
      lastCompletedAt: null,
      nextDueDate: null,
      notes: "",
    },
    {
      id: "post-003",
      title: "Monitor postharvest water for organic material buildup",
      description:
        "During harvest/packing/holding, visually monitor wash/cooling water for organic material buildup.",
      category: "Postharvest Handling & Sanitation",
      frequency: "weekly",
      status: "not_started",
      evidenceRequired: false,
      lastCompletedAt: null,
      nextDueDate: null,
      notes: "",
    },
    {
      id: "post-004",
      title: "Dispose of handwashing water properly",
      description:
        "Dispose of water used for washing hands using measures to reduce contamination to covered produce.",
      category: "Postharvest Handling & Sanitation",
      frequency: "monthly",
      status: "not_started",
      evidenceRequired: false,
      lastCompletedAt: null,
      nextDueDate: null,
      notes: "",
    },
    {
      id: "rec-001",
      title: "Review training record completeness (self-check)",
      description:
        "Self-check that training records (date, topics, people trained) exist and are up to date. No uploads in this app.",
      category: "Records & Documentation",
      frequency: "annual",
      status: "not_started",
      evidenceRequired: false,
      lastCompletedAt: null,
      nextDueDate: null,
      notes: "Do not enter sensitive details",
    },
    {
      id: "rec-002",
      title: "Review water inspection/testing documentation exists (self-check)",
      description:
        "Self-check that water system inspections and water test documentation exist (where applicable). No uploads in this app.",
      category: "Records & Documentation",
      frequency: "annual",
      status: "not_started",
      evidenceRequired: false,
      lastCompletedAt: null,
      nextDueDate: null,
      notes: "Do not enter results or confidential info",
    },
    {
      id: "rec-003",
      title: "Review soil amendment documentation is current (self-check)",
      description:
        "Self-check that supplier docs/process control documentation is current (where applicable). No uploads in this app.",
      category: "Records & Documentation",
      frequency: "annual",
      status: "not_started",
      evidenceRequired: false,
      lastCompletedAt: null,
      nextDueDate: null,
      notes: "",
    },
    {
      id: "rec-004",
      title: "Log corrective action occurred (checklist only)",
      description:
        "If corrective actions are taken (water, wildlife, sanitation), record that an action occurred—without details or attachments.",
      category: "Records & Documentation",
      frequency: "per-event",
      status: "not_started",
      evidenceRequired: false,
      lastCompletedAt: null,
      nextDueDate: null,
      notes: "Keep notes non-sensitive",
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
    const refreshed = {
      ...parsed,
      tasks: refreshOverdueTasks(parsed.tasks, now),
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
