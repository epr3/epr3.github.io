import { defineCollection, reference } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const experience = defineCollection({
  loader: glob({ base: "./src/content/experience", pattern: "**/*.json" }),
  schema: z.object({
    companyName: z.string(),
    order: z.number(),
  }),
});

const titles = defineCollection({
  loader: glob({ base: "./src/content/titles", pattern: "**/*.json" }),
  schema: z.object({
    company: reference("experience"),
    title: z.string(),
    startDate: z.string(),
    endDate: z.string().optional(),
  }),
});

const projects = defineCollection({
  loader: glob({ base: "./src/content/projects", pattern: "**/*.md" }),
  schema: z.object({
    company: reference("experience"),
    skills: z.object({
      frontend: z.array(reference("skills")).optional(),
      backend: z.array(reference("skills")).optional(),
      devops: z.array(reference("skills")).optional(),
      general: z.array(reference("skills")).optional(),
    }),
    order: z.number(),
  }),
});

const skills = defineCollection({
  loader: glob({ base: "./src/content/skills", pattern: "**/*.json" }),
  schema: z.object({
    name: z.string(),
  }),
});

export const collections = { experience, titles, projects, skills };
