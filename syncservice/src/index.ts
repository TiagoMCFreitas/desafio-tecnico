import { CoinsMarketFormatted } from "./api/@types/coinsMarket";
import { requestCryptoApi } from "./api/get";
import { insertCryptosDataOnDatabase } from "./db/insert";
import { timeSleep } from "./utils/timeSleep";

const COINGECKO_API_KEY = process.env.COINGECKO_API_KEY;

const insertDataOnDatabase = async () => {
  while (true) {
    const cryptos: CoinsMarketFormatted[] = await requestCryptoApi(
      COINGECKO_API_KEY
    );
    await insertCryptosDataOnDatabase(cryptos);
    console.log("Esperando 5 minutos!");
    await timeSleep(300000);
  }
};

insertDataOnDatabase();
