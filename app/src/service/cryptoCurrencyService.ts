import { CryptoCurrencyRepository } from "../repository/cryptoCurrencyRepository";

export class CryptoCurrencyService {
  constructor(private cryptoCurrencyRepository: CryptoCurrencyRepository) {}

  findCryptos = async (filter) => {
    return await this.cryptoCurrencyRepository.findCryptos(filter);
  };
}
