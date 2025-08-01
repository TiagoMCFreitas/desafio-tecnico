import { CryptoCurrencyRepository } from "../repository/cryptoCurrencyRepository";

export class CryptoCurrencyService {
  constructor(private cryptoCurrencyRepository: CryptoCurrencyRepository) {}

  findCryptos = async (filterParams) => {
    return await this.cryptoCurrencyRepository.findCryptos(filterParams);
  };
  orderCryptos = async (orderParams) => {
    const orderByArray = Object.keys(orderParams).map((key) => {
      return { [key]: orderParams[key] };
    });
    const removingNullValues = Object.keys(orderParams)
      .map((key) => {
        if (key !== "id") {
          return {
            [key]: {
              not: null,
            },
          };
        }
      })
      .filter(Boolean);

    return await this.cryptoCurrencyRepository.orderCryptos(
      orderParams,
      removingNullValues,
      orderByArray
    );
  };
}
