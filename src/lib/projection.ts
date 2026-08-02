// --- Raw entry shapes mirroring Astro Content Layer API at runtime ---

export interface RawCompanyEntry {
  id: string;
  data: { companyName: string; order: number };
}

export interface RawRoleEntry {
  id: string;
  data: {
    company: { id: string; collection: string };
    title: string;
    startDate: string;
    endDate?: string;
  };
}

export interface RawProjectEntry {
  id: string;
  data: {
    company: { id: string; collection: string };
    skills: {
      frontend?: { id: string; collection: string }[];
      backend?: { id: string; collection: string }[];
      devops?: { id: string; collection: string }[];
      general?: { id: string; collection: string }[];
    };
    order: number;
  };
  body?: string;
}

export interface RawSkillEntry {
  id: string;
  data: { name: string };
}

// --- Projected types consumed by presentation ---

export interface ProjectedSkill {
  id: string;
  name: string;
}

export interface ProjectedRole {
  title: string;
  startDate: string;
  endDate?: string;
}

export interface ProjectedProject {
  id: string;
  name: string;
  stack: ProjectedSkill[];
  entry: RawProjectEntry;
}

export interface ProjectedCompany {
  name: string;
  order: number;
  roles: ProjectedRole[];
  projects: ProjectedProject[];
}

export interface ProjectedExperience {
  companies: ProjectedCompany[];
}

// --- Errors ---

export class ProjectionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProjectionError";
  }
}

// --- Helpers ---

const SKILL_CATEGORIES = ["frontend", "backend", "devops", "general"] as const;

/**
 * UTC-safe month-year formatter.
 * Avoids timezone shifts that would display e.g. "2016-05-01" as April
 * when the local timezone is behind UTC.
 */
export function formatMonthYear(dateStr: string): string {
  const [year, month] = dateStr.split("-").map(Number);
  const d = new Date(Date.UTC(year, month - 1, 15));
  return d.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

// --- Core projection ---

export function projectExperience(
  companies: RawCompanyEntry[],
  roles: RawRoleEntry[],
  projects: RawProjectEntry[],
  skills: RawSkillEntry[]
): ProjectedExperience {
  // Index skills by id for O(1) lookup
  const skillMap = new Map(skills.map((s) => [s.id, s]));

  // Validate company references in roles
  const companyIds = new Set(companies.map((c) => c.id));

  for (const role of roles) {
    if (!companyIds.has(role.data.company.id)) {
      throw new ProjectionError(
        `Role "${role.id}" references non-existent company "${role.data.company.id}"`
      );
    }
  }

  // Validate company references in projects
  for (const project of projects) {
    if (!companyIds.has(project.data.company.id)) {
      throw new ProjectionError(
        `Project "${project.id}" references non-existent company "${project.data.company.id}"`
      );
    }
  }

  // Resolve skills for a project: flatten categories in order, deduplicate
  function resolveProjectSkills(
    skillRefs: RawProjectEntry["data"]["skills"]
  ): ProjectedSkill[] {
    const seen = new Set<string>();
    const result: ProjectedSkill[] = [];

    for (const category of SKILL_CATEGORIES) {
      const refs = skillRefs[category] ?? [];
      for (const ref of refs) {
        if (seen.has(ref.id)) continue;
        seen.add(ref.id);

        const skill = skillMap.get(ref.id);
        if (!skill) {
          throw new ProjectionError(
            `Project references non-existent skill "${ref.id}"`
          );
        }
        result.push({ id: skill.id, name: skill.data.name });
      }
    }

    return result;
  }

  // Group roles and projects under their company
  const roleGroups = new Map<string, RawRoleEntry[]>();
  for (const role of roles) {
    const cid = role.data.company.id;
    if (!roleGroups.has(cid)) roleGroups.set(cid, []);
    roleGroups.get(cid)!.push(role);
  }

  const projectGroups = new Map<string, RawProjectEntry[]>();
  for (const project of projects) {
    const cid = project.data.company.id;
    if (!projectGroups.has(cid)) projectGroups.set(cid, []);
    projectGroups.get(cid)!.push(project);
  }

  // Build projected companies, ordered descending by order
  const projectedCompanies: ProjectedCompany[] = companies
    .slice()
    .sort((a, b) => b.data.order - a.data.order)
    .map((company) => {
      const companyRoles = (roleGroups.get(company.id) ?? [])
        .sort((a, b) => b.data.startDate.localeCompare(a.data.startDate))
        .map((r): ProjectedRole => ({
          title: r.data.title,
          startDate: r.data.startDate,
          endDate: r.data.endDate,
        }));

      const companyProjects = (projectGroups.get(company.id) ?? [])
        .sort((a, b) => b.data.order - a.data.order)
        .map((p): ProjectedProject => ({
          id: p.id,
          name: p.id,
          stack: resolveProjectSkills(p.data.skills),
          entry: p,
        }));

      return {
        name: company.data.companyName,
        order: company.data.order,
        roles: companyRoles,
        projects: companyProjects,
      };
    });

  return { companies: projectedCompanies };
}
