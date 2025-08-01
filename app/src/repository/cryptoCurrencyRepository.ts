import { prisma } from "../utils/database";

export class CryptoCurrencyRepository {
  findCryptos = async (filter) => {
    console.log(parseInt(filter.offset));
    const cryptoCurrencyRequisitionInfos = {
      limit: parseInt(filter.limit) || 100,
      offset: parseInt(filter.offset) || 0,
      count: await prisma.cryptoCurrency.count(),
    };
    const cryptos = await prisma.cryptoCurrency.findMany({
      take: parseInt(filter.limit) || 100,
      skip: parseInt(filter.offset) || 0,
    });

    return {
      cryptos,
      cryptoCurrencyRequisitionInfos,
    };
  };
}
