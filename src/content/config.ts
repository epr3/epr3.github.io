import { defineCollection, reference, z } from "astro:content";

const awardsCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
  }),
});

const educationCollection = defineCollection({
  type: "data",
  schema: z.object({
    title: z.string(),
    specialisation: z.string(),
    level: z.string(),
    startYear: z.number(),
    endYear: z.number(),
    logo: z.string().optional(),
  }),
});

const experiencesCollection = defineCollection({
  type: "data",
  schema: z.object({
    companyName: z.string(),
    startDate: z.string(),
    endDate: z.string().optional(),
    logo: z.string().optional(),
  }),
});

const projectsCollection = defineCollection({
  type: "content",
  schema: z.object({
    company: reference("experience"),
    frontend: z.array(reference("skills")).optional(),
    backend: z.array(reference("skills")).optional(),
    devops: z.array(reference("skills")).optional(),
    general: z.array(reference("skills")).optional(),
  }),
});

const volunteeringCollection = defineCollection({
  type: "content",
  schema: z.object({
    orgName: z.string(),
    startDate: z.string(),
    endDate: z.string().optional(),
    logo: z.string().optional(),
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
  awards: awardsCollection,
  education: educationCollection,
  experience: experiencesCollection,
  volunteering: volunteeringCollection,
  skills: skillsCollections,
  projects: projectsCollection,
};
