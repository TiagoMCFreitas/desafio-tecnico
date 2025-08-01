import { Request, Response, Router } from "express";
import { FilterCryptoCurrencySchema } from "../dto/cryptoCurrency/filterCryptoCurrency";
import { CryptoCurrencyRepository } from "../repository/cryptoCurrencyRepository";
import { CryptoCurrencyService } from "../service/cryptoCurrencyService";
import { validateInputSchemas } from "../validate/input";

const cryptoCurrencyRouter = Router();
const cryptoCurrencyRepository = new CryptoCurrencyRepository();
const cryptoCurrencyService = new CryptoCurrencyService(
  cryptoCurrencyRepository
);
cryptoCurrencyRouter.get("/", async (req: Request, res: Response) => {
  try {
    const params = req.query;
    const validateSearchParams = await validateInputSchemas(
      FilterCryptoCurrencySchema,
      params
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
