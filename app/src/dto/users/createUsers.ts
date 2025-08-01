import z from "zod";
export const CreateUsersSchema = z.object({
  name: z.string("O nome é obrigatório").min(1, "O nome não pode ser vazio"),
  email: z.email("O email é obrigatório e deve ser válido"),
  password: z
    .string("A senha é obrigatória")
    .min(1, "A senha não pode ser vazia"),
  role: z.enum(["admin", "cliente"], "O valor deve ser (admin) ou (cliente)"),
});

export type CreateUsersDto = z.infer<typeof CreateUsersSchema>;
