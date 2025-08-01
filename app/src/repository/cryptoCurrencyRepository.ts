import { prisma } from "../utils/database";

export class CryptoCurrencyRepository {
  findCryptos = async (params) => {
    const { offset, limit, ...filterParams } = params;
    const cryptoCurrencyRequisitionInfos = {
      limit: parseInt(limit) || 100,
      offset: parseInt(offset) || 0,
      count: await prisma.cryptoCurrency.count(),
    };

    console.log(params);
    const cryptos = await prisma.cryptoCurrency.findMany({
      where: filterParams,
      take: parseInt(limit) || 100,
      skip: parseInt(offset) || 0,
    });
    return {
      cryptos,
      cryptoCurrencyRequisitionInfos,
    };
  };
  orderCryptos = async (params, removingNullValues, orderByArray) => {
    const { offset, limit } = params;
    const cryptoCurrencyRequisitionInfos = {
      limit: parseInt(limit) || 100,
      offset: parseInt(offset) || 0,
      count: await prisma.cryptoCurrency.count(),
    };

    const cryptos = await prisma.cryptoCurrency.findMany({
      take: parseInt(limit) || 100,
      skip: parseInt(offset) || 0,
      where: {
        AND: removingNullValues,
      },
      orderBy: orderByArray,
    });
    return {
      cryptos,
      cryptoCurrencyRequisitionInfos,
    };
  };
}
