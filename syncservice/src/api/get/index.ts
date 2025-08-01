import { timeSleep } from "../../utils/timeSleep";
import {
  CoinsMarketFormatted,
  CoinsMarketResponse,
} from "../@types/coinsMarket";

export const requestCryptoApi = async (apiKey) => {
  try {
    let page = 1;
    let statusOk = false;
    const cryptosArray: CoinsMarketFormatted[] = [];
    while (!statusOk) {
      console.log(page);
      const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=brl&price_change_percentage=7d&page=${page}&per_page=250`;
      const cryptoRequest = await fetch(url, {
        method: "GET",
        headers: {
          "x-cg-demo-api-key": apiKey,
        },
      });
      const status = cryptoRequest.status;
      if (status !== 200) {
        await timeSleep(60000);
        continue;
      }
      const data: CoinsMarketResponse[] = await cryptoRequest.json();
      data.map((crypto) => {
        cryptosArray.push({
          id: crypto.id,
          name: crypto.name,
          marketCap: crypto.market_cap,
          priceChange24h: crypto.price_change_percentage_24h,
          priceChange7D: crypto.price_change_percentage_7d_in_currency,
          ath: crypto.ath,
          atl: crypto.atl,
          currentPrice: crypto.current_price,
        });
      });
      if (data.length === 0) {
        statusOk = true;
        break;
      }
      page += 1;
    }
    return cryptosArray;
  } catch (error) {
    return error;
  }
};
