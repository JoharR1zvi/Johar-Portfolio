import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().min(1).max(254).email(),
  message: z.string().trim().min(10).max(2000),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
