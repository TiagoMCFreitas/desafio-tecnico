import z from "zod";
export const UserSchema = z.object({
  name: z.string("O nome é obrigatório").min(1),
  email: z.email("O email é obrigatório e deve ser válido"),
  password: z.string("A senha é obrigatória").min(1),
  role: z.enum(["admin", "cliente"], "O valor deve ser (admin) ou (cliente) "),
});
