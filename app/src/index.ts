import express from "express";
import swaggerUi from "swagger-ui-express";
import { openApiDocument } from "./docs/swagger"; // caminho onde está o código acima

import cryptoCurrencyRouter from "./controller/cryptoCurrencyController";
import userRouter from "./controller/userController";
const app = express();
const PORT = 8080;

app.use(express.json());

app.use("/users", userRouter);
app.use("/cryptos", cryptoCurrencyRouter);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
