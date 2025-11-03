import z from 'zod';

const RegisterSchema = z.object({
  username: z.string().min(1).max(255),
  email: z.string().email().max(320).optional(),
  password: z.string().min(8).max(128),
  role: z.enum(['user', 'admin']).default('user'),
  is_active: z.boolean().default(true),
  jwt_token_version: z.number().int().positive().default(1).optional(),
  first_name: z.string().min(1).max(255),
  last_name: z.string().min(1).max(255),
});

export default RegisterSchema;
