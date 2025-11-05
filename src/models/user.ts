import z from 'zod';

const RegisterSchema = z.object({
  username: z.string().min(1).max(255),
  email: z.string().email().max(320).optional(),
  password: z.string().min(8).max(128),
  is_active: z.boolean().default(true),
  first_name: z.string().min(1).max(255),
  last_name: z.string().min(1).max(255),
});

export default RegisterSchema;
