import { CoinsMarketFormatted } from "../../api/@types/coinsMarket";
import { prisma } from "../../utils/database";

export const insertCryptosDataOnDatabase = async (
  data: CoinsMarketFormatted[]
) => {
  await prisma.cryptoCurrency.deleteMany({});
  return await prisma.cryptoCurrency.createMany({
    data: data,
    skipDuplicates: true,
  });
};
