import { Request, Response, Router } from "express";
import { UserSchema } from "../schema/userSchema";
import { UserService } from "../service/userService";

const userRouter = Router();
const userService = new UserService();

userRouter.get("/", async (res: Response) => {
  try {
    const users = await userService.findAllUsers();
    res.status(200).send({ users: users });

    return users;
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: error,
    });
  }
});
userRouter.post("/", async (req: Request, res: Response) => {
  try {
    const user = UserSchema.safeParse(req.body);

    if (!user.success) {
      const formattedErrors = user.error!.issues.map((error) => {
        return { campo: error.path[0], mensagem: error.message };
      });
      res.status(400).send(formattedErrors);
      return formattedErrors;
    }

    const createdUser = await userService.createUser(user.data);

    if (createdUser.status === 400) {
      res.status(createdUser.status).send(createdUser);
      return createdUser;
    }

    res.status(201).send(createdUser);
    return createdUser;
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: error,
    });
  }
});

export default userRouter;
