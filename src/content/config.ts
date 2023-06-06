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
  type: "content",
  schema: z.object({
    companyName: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    logo: z.string().optional(),
    skills: z.array(reference("skills")),
  }),
});

const volunteeringCollection = defineCollection({
  type: "content",
  schema: z.object({
    orgName: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    logo: z.string().optional(),
  }),
});

const skillsCollections = defineCollection({
  type: "data",
  schema: z.object({
    skillName: z.string(),
    icon: z.string().optional(),
  }),
});

export const collections = {
  awards: awardsCollection,
  education: educationCollection,
  experience: experiencesCollection,
  volunteering: volunteeringCollection,
  skills: skillsCollections,
};
