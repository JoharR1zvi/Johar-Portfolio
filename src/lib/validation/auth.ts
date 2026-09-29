import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().min(1).max(254).email(),
  password: z.string().min(1).max(200),
});

export type LoginValues = z.infer<typeof loginSchema>;
