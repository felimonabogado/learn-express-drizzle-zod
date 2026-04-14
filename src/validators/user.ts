import { z } from "zod";

const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
});

export { createUserSchema };