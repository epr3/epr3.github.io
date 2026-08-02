import { getCollection } from "astro:content";
import { projectExperience, type ProjectedExperience } from "./projection";

export async function loadExperience(): Promise<ProjectedExperience> {
  const [companyEntries, roleEntries, projectEntries, skillEntries] =
    await Promise.all([
      getCollection("experience"),
      getCollection("titles"),
      getCollection("projects"),
      getCollection("skills"),
    ]);

  return projectExperience(
    companyEntries.map((e) => ({ id: e.id, data: e.data })),
    roleEntries.map((e) => ({ id: e.id, data: e.data })),
    projectEntries.map((e) => ({
      id: e.id,
      data: e.data,
      body: e.body,
    })),
    skillEntries.map((e) => ({ id: e.id, data: e.data }))
  );
}
