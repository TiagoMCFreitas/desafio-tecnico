import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import z from "zod";
extendZodWithOpenApi(z);
export const FilterUsersSchema = z
  .object({
    id: z
      .string()
      .transform((value) => parseInt(value))
      .refine((value) => !isNaN(Number(value)), {
        message: "O id não pode ser uma string",
      })
      .optional(),
    name: z.string().min(1, "O nome não pode ser vazio").optional(),
    email: z.email("O email deve ser válido").optional(),
    role: z
      .enum(["admin", "cliente"], "O valor deve ser (admin) ou (cliente)")
      .optional(),
    offset: z.string().optional(),
    limit: z
      .string()
      .transform((value) => parseInt(value))
      .refine((value) => value <= 200, {
        message: "O valor máximo de limite é 200",
      })
      .optional(),
  })
  .strict()
  .describe("Campo inválido")
  .openapi("FilterUsers");

export type FilterUsersDto = z.infer<typeof FilterUsersSchema>;
