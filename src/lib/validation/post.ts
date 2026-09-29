import { z } from 'zod';

export const postSlugSchema = z
  .string()
  .trim()
  .min(1)
  .max(80)
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Lowercase letters, numbers, and hyphens only.');
