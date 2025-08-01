import z from "zod";
export const UpdateUsersSchema = z
  .object({
    name: z
      .string("O nome é obrigatório")
      .min(1, "O nome não pode ser vazio")
      .optional(),
    email: z.email("O email deve ser válido").optional(),
    role: z
      .enum(["admin", "cliente"], "O valor deve ser (admin) ou (cliente)")
      .optional(),
  })
  .strict()
  .openapi("UpdateUsers");

export type UpdateUsersDto = z.infer<typeof UpdateUsersSchema>;
