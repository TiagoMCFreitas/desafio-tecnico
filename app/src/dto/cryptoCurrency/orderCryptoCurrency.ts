import z from "zod";
export const OrderCryptoCurrencySchema = z
  .object({
    id: z.enum(["asc", "desc"]).optional(),
    name: z.enum(["asc", "desc"]).optional(),
    currentPrice: z.enum(["asc", "desc"]).optional(),
    marketCap: z.enum(["asc", "desc"]).optional(),
    percentPriceChange24h: z.enum(["asc", "desc"]).optional(),
    percentPriceChange7D: z.enum(["asc", "desc"]).optional(),
    ath: z.enum(["asc", "desc"]).optional(),
    atl: z.enum(["asc", "desc"]).optional(),
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

export type OrderCryptoCurrencyDto = z.infer<typeof OrderCryptoCurrencySchema>;
