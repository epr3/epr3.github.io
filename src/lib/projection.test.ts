import { describe, it, expect } from "vitest";
import {
  projectExperience,
  formatMonthYear,
  ProjectionError,
  type RawCompanyEntry,
  type RawRoleEntry,
  type RawProjectEntry,
  type RawSkillEntry,
} from "./projection";

// --- Fixture helpers ---

function makeCompany(
  id: string,
  companyName: string,
  order: number
): RawCompanyEntry {
  return { id, data: { companyName, order } };
}

function makeRole(
  id: string,
  companyId: string,
  title: string,
  startDate: string,
  endDate?: string
): RawRoleEntry {
  return {
    id,
    data: {
      company: { id: companyId, collection: "experience" },
      title,
      startDate,
      endDate,
    },
  };
}

function makeProject(
  id: string,
  companyId: string,
  order: number,
  skills: RawProjectEntry["data"]["skills"] = {},
  body?: string
): RawProjectEntry {
  return {
    id,
    data: {
      company: { id: companyId, collection: "experience" },
      skills,
      order,
    },
    body,
  };
}

function makeSkill(id: string, name: string): RawSkillEntry {
  return { id, data: { name } };
}

function ref(id: string) {
  return { id, collection: "skills" };
}

// --- Tests ---

describe("projectExperience", () => {
  describe("ordering", () => {
    it("sorts companies descending by order", () => {
      const result = projectExperience(
        [
          makeCompany("a", "Alpha", 1),
          makeCompany("b", "Beta", 3),
          makeCompany("c", "Gamma", 2),
        ],
        [],
        [],
        []
      );
      expect(result.companies.map((c) => c.name)).toEqual([
        "Beta",
        "Gamma",
        "Alpha",
      ]);
    });

    it("sorts roles descending by startDate within a company", () => {
      const result = projectExperience(
        [makeCompany("c1", "Co", 1)],
        [
          makeRole("r1", "c1", "Junior", "2020-01-01", "2022-01-01"),
          makeRole("r2", "c1", "Senior", "2022-06-01"),
          makeRole("r3", "c1", "Lead", "2023-01-01"),
        ],
        [],
        []
      );
      expect(result.companies[0].roles.map((r) => r.title)).toEqual([
        "Lead",
        "Senior",
        "Junior",
      ]);
    });

    it("sorts projects descending by order within a company", () => {
      const result = projectExperience(
        [makeCompany("c1", "Co", 1)],
        [],
        [
          makeProject("p1", "c1", 1),
          makeProject("p2", "c1", 3),
          makeProject("p3", "c1", 2),
        ],
        []
      );
      expect(result.companies[0].projects.map((p) => p.id)).toEqual([
        "p2",
        "p3",
        "p1",
      ]);
    });
  });

  describe("grouping", () => {
    it("groups roles and projects under their company", () => {
      const result = projectExperience(
        [makeCompany("c1", "Alpha", 1), makeCompany("c2", "Beta", 2)],
        [
          makeRole("r1", "c1", "Dev", "2020-01-01"),
          makeRole("r2", "c2", "Eng", "2021-01-01"),
        ],
        [makeProject("p1", "c1", 1), makeProject("p2", "c2", 1)],
        []
      );

      const alpha = result.companies.find((c) => c.name === "Alpha")!;
      const beta = result.companies.find((c) => c.name === "Beta")!;

      expect(alpha.roles).toHaveLength(1);
      expect(alpha.roles[0].title).toBe("Dev");
      expect(alpha.projects).toHaveLength(1);
      expect(alpha.projects[0].id).toBe("p1");

      expect(beta.roles).toHaveLength(1);
      expect(beta.roles[0].title).toBe("Eng");
      expect(beta.projects).toHaveLength(1);
      expect(beta.projects[0].id).toBe("p2");
    });

    it("supports multiple roles at one company", () => {
      const result = projectExperience(
        [makeCompany("c1", "Co", 1)],
        [
          makeRole("r1", "c1", "Junior", "2018-01-01", "2020-01-01"),
          makeRole("r2", "c1", "Senior", "2020-06-01"),
        ],
        [],
        []
      );

      expect(result.companies[0].roles).toHaveLength(2);
    });
  });

  describe("tech stack resolution", () => {
    it("resolves skill names in category order (frontend, backend, devops, general)", () => {
      const skills = [
        makeSkill("vue", "Vue"),
        makeSkill("node", "Node.js"),
        makeSkill("docker", "Docker"),
        makeSkill("misc", "Misc"),
      ];

      const result = projectExperience(
        [makeCompany("c1", "Co", 1)],
        [],
        [
          makeProject("p1", "c1", 1, {
            general: [ref("misc")],
            frontend: [ref("vue")],
            devops: [ref("docker")],
            backend: [ref("node")],
          }),
        ],
        skills
      );

      const stack = result.companies[0].projects[0].stack;
      expect(stack.map((s) => s.name)).toEqual([
        "Vue",
        "Node.js",
        "Docker",
        "Misc",
      ]);
    });

    it("deduplicates repeated skills across categories", () => {
      const skills = [
        makeSkill("html", "HTML"),
        makeSkill("vue", "Vue"),
        makeSkill("node", "Node.js"),
      ];

      const result = projectExperience(
        [makeCompany("c1", "Co", 1)],
        [],
        [
          makeProject("p1", "c1", 1, {
            frontend: [ref("html"), ref("vue")],
            backend: [ref("html"), ref("node")],
          }),
        ],
        skills
      );

      const stack = result.companies[0].projects[0].stack;
      expect(stack.map((s) => s.name)).toEqual(["HTML", "Vue", "Node.js"]);
    });

    it("handles empty/optional skill categories", () => {
      const result = projectExperience(
        [makeCompany("c1", "Co", 1)],
        [],
        [makeProject("p1", "c1", 1, {})],
        []
      );

      expect(result.companies[0].projects[0].stack).toEqual([]);
    });
  });

  describe("optional content", () => {
    it("handles company with no roles or projects", () => {
      const result = projectExperience(
        [makeCompany("c1", "Empty Co", 1)],
        [],
        [],
        []
      );

      expect(result.companies[0].roles).toEqual([]);
      expect(result.companies[0].projects).toEqual([]);
    });

    it("handles role without endDate (present role)", () => {
      const result = projectExperience(
        [makeCompany("c1", "Co", 1)],
        [makeRole("r1", "c1", "Current Role", "2023-01-01")],
        [],
        []
      );

      expect(result.companies[0].roles[0].endDate).toBeUndefined();
    });

    it("preserves project body for markdown interpretation", () => {
      const body = "### Project Name\n\n- bullet 1\n- bullet 2";
      const result = projectExperience(
        [makeCompany("c1", "Co", 1)],
        [],
        [makeProject("p1", "c1", 1, {}, body)],
        []
      );

      expect(result.companies[0].projects[0].entry.body).toBe(body);
    });
  });

  describe("invalid references", () => {
    it("throws on role referencing non-existent company", () => {
      expect(() =>
        projectExperience(
          [makeCompany("c1", "Co", 1)],
          [makeRole("r1", "ghost", "Phantom", "2020-01-01")],
          [],
          []
        )
      ).toThrow(ProjectionError);
    });

    it("throws on project referencing non-existent company", () => {
      expect(() =>
        projectExperience(
          [makeCompany("c1", "Co", 1)],
          [],
          [makeProject("p1", "ghost", 1)],
          []
        )
      ).toThrow(ProjectionError);
    });

    it("throws on project referencing non-existent skill", () => {
      expect(() =>
        projectExperience(
          [makeCompany("c1", "Co", 1)],
          [],
          [makeProject("p1", "c1", 1, { frontend: [ref("ghost")] })],
          []
        )
      ).toThrow(ProjectionError);
    });

    it("includes the offending id in the error message", () => {
      expect(() =>
        projectExperience(
          [makeCompany("c1", "Co", 1)],
          [makeRole("r1", "missing-co", "X", "2020-01-01")],
          [],
          []
        )
      ).toThrow("missing-co");
    });
  });

  describe("internship dates", () => {
    it("formats corrected internship as May 2016 through September 2016", () => {
      const result = projectExperience(
        [makeCompany("internship", "Eau de Web", 1)],
        [
          makeRole(
            "fe-intern-edw",
            "internship",
            "Front End Intern",
            "2016-05-01",
            "2016-09-01"
          ),
        ],
        [],
        []
      );

      const role = result.companies[0].roles[0];
      expect(formatMonthYear(role.startDate)).toBe("May 2016");
      expect(formatMonthYear(role.endDate!)).toBe("Sep 2016");
    });
  });

  describe("realistic fixture", () => {
    it("projects a multi-company dataset correctly", () => {
      const companies = [
        makeCompany("flowx", "FlowX.AI", 5),
        makeCompany("cognizant", "Cognizant", 4),
        makeCompany("internship", "Eau de Web", 1),
      ];

      const roles = [
        makeRole(
          "sr-fe-flowx",
          "flowx",
          "Senior Frontend Engineer",
          "2024-07-09"
        ),
        makeRole(
          "sr-eng-cognizant",
          "cognizant",
          "Senior Engineer",
          "2023-06-01",
          "2024-07-08"
        ),
        makeRole(
          "eng-cognizant",
          "cognizant",
          "Engineer",
          "2020-06-01",
          "2023-06-01"
        ),
        makeRole(
          "intern",
          "internship",
          "Front End Intern",
          "2016-05-01",
          "2016-09-01"
        ),
      ];

      const skills = [
        makeSkill("react", "React"),
        makeSkill("vue", "Vue"),
        makeSkill("node", "Node.js"),
        makeSkill("docker", "Docker"),
      ];

      const projects = [
        makeProject("flowx-proj", "flowx", 1, { frontend: [ref("react")] }),
        makeProject("cog-proj", "cognizant", 2, {
          frontend: [ref("vue")],
          backend: [ref("node")],
          devops: [ref("docker")],
        }),
        makeProject("intern-proj", "internship", 1, { frontend: [ref("vue")] }),
      ];

      const result = projectExperience(companies, roles, projects, skills);

      // Companies descending by order
      expect(result.companies.map((c) => c.name)).toEqual([
        "FlowX.AI",
        "Cognizant",
        "Eau de Web",
      ]);

      // FlowX: 1 role (present), 1 project
      const flowx = result.companies[0];
      expect(flowx.roles).toHaveLength(1);
      expect(flowx.roles[0].endDate).toBeUndefined();
      expect(flowx.projects).toHaveLength(1);

      // Cognizant: 2 roles (Senior first), 1 project
      const cognizant = result.companies[1];
      expect(cognizant.roles).toHaveLength(2);
      expect(cognizant.roles[0].title).toBe("Senior Engineer");
      expect(cognizant.projects[0].stack.map((s) => s.name)).toEqual([
        "Vue",
        "Node.js",
        "Docker",
      ]);

      // Internship: 1 role (May–Sep 2016), 1 project
      const internship = result.companies[2];
      expect(formatMonthYear(internship.roles[0].startDate)).toBe("May 2016");
      expect(formatMonthYear(internship.roles[0].endDate!)).toBe("Sep 2016");
    });
  });
});

describe("formatMonthYear", () => {
  it("formats as MMM YYYY in English", () => {
    expect(formatMonthYear("2024-01-15")).toBe("Jan 2024");
    expect(formatMonthYear("2023-12-01")).toBe("Dec 2023");
  });

  it("does not shift dates due to timezone", () => {
    // "2016-05-01" should always be May, never April
    expect(formatMonthYear("2016-05-01")).toBe("May 2016");
  });
});
