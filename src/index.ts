import express from "express";
import userRouter from "./controller/userController";
const app = express();
const PORT = 8080;

app.use(express.json());
app.use("/users", userRouter);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
