export type CoinsMarketResponse = {
  id: string;
  name: string;
  current_price: number;
  market_cap: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d_in_currency: number;
  ath: number;
  atl: number;
};

export type CoinsMarketFormatted = {
  id: string;
  name: string;
  marketCap: number;
  percentPriceChange24h: number;
  percentPriceChange7D: number;
  ath: number;
  atl: number;
  currentPrice: number;
};
