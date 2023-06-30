import { defineCollection, reference, z } from "astro:content";

const experiencesCollection = defineCollection({
  type: "data",
  schema: z.object({
    companyName: z.string(),
    logo: z.string().optional(),
  }),
});

const titlesCollection = defineCollection({
  type: "data",
  schema: z.object({
    company: reference("experience"),
    title: z.string(),
    startDate: z.string(),
    endDate: z.string().optional(),
  }),
});

const projectsCollection = defineCollection({
  type: "content",
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

const skillsCollections = defineCollection({
  type: "data",
  schema: z.object({
    name: z.string(),
    logo: z.string().optional(),
  }),
});

export const collections = {
  experience: experiencesCollection,
  skills: skillsCollections,
  projects: projectsCollection,
  titles: titlesCollection,
};
