import { z } from "zod";

export const linkFormSchema = z.object({
  title: z.string().min(1),
  url: z.string().min(1).url(),
  isPublic: z.boolean(),
});

export type LinkFormSchema = z.infer<typeof linkFormSchema>;
