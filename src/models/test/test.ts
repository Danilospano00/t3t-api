import z from 'zod';

const TestSchema = z.object({
  username: z.string().min(1).max(255),
  jwt_token_version: z.number().int().positive().default(1).optional(),
});

export default TestSchema;
