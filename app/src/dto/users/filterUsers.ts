import z from "zod";
export const FilterUsersSchema = z
  .object({
    name: z
      .string("O nome é obrigatório")
      .min(1, "O nome não pode ser vazio")
      .optional(),
    email: z.email("O email é obrigatório e deve ser válido").optional(),
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
  .describe("Campo inválido");

export type FilterUsersDto = z.infer<typeof FilterUsersSchema>;
