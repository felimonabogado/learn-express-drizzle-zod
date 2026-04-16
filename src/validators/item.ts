import { z } from "zod";

const createItemsScheme = z.object({
  name: z.string().min(1),
  price: z.number().int().positive(),
  description: z.string().optional(),
});

export { createItemsScheme };