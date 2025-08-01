import z from "zod";
export const FilterCryptoCurrencySchema = z
  .object({
    id: z.string().min(1, "O id não pode ser vazio").optional(),
    name: z.string().min(1, "O nome não pode ser vazio").optional(),
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

export type FilterCryptoCurrencyDto = z.infer<
  typeof FilterCryptoCurrencySchema
>;
