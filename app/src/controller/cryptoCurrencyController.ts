import { Request, Response, Router } from "express";
import { FilterCryptoCurrencySchema } from "../dto/cryptoCurrency/filterCryptoCurrency";
import { OrderCryptoCurrencySchema } from "../dto/cryptoCurrency/orderCryptoCurrency";
import { CryptoCurrencyRepository } from "../repository/cryptoCurrencyRepository";
import { CryptoCurrencyService } from "../service/cryptoCurrencyService";
import { validateInputSchemas } from "../validate/input";

const cryptoCurrencyRouter = Router();
const cryptoCurrencyRepository = new CryptoCurrencyRepository();
const cryptoCurrencyService = new CryptoCurrencyService(
  cryptoCurrencyRepository
);

cryptoCurrencyRouter.get("/order/", async (req: Request, res: Response) => {
  try {
    const orderParams = req.query;
    const validateSearchParams = await validateInputSchemas(
      OrderCryptoCurrencySchema,
      orderParams
    );
    if (validateSearchParams.error) {
      res.status(400).send(validateSearchParams.errors);
      return validateSearchParams.errors;
    }
    const cryptos = await cryptoCurrencyService.orderCryptos(
      validateSearchParams.body
    );
    res.status(200).send(cryptos);
  } catch (error: any) {
    res.status(500).send({
      status: 500,
      message: error.message,
    });
  }
});

cryptoCurrencyRouter.get("/", async (req: Request, res: Response) => {
  try {
    const filterParams = req.query;
    const validateSearchParams = await validateInputSchemas(
      FilterCryptoCurrencySchema,
      filterParams
    );
    if (validateSearchParams.error) {
      res.status(400).send(validateSearchParams.errors);
      return validateSearchParams.errors;
    }
    const cryptos = await cryptoCurrencyService.findCryptos(
      validateSearchParams.body
    );
    res.status(200).send(cryptos);
    return cryptos;
  } catch (error: any) {
    res.status(500).send({
      status: 500,
      message: error.message,
    });
  }
});
export default cryptoCurrencyRouter;
