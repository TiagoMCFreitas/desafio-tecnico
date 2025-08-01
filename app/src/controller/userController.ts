import { Request, Response, Router } from "express";
import { CreateUsersSchema } from "../dto/users/createUsers";
import { FilterUsersSchema } from "../dto/users/filterUsers";
import { UpdateUsersSchema } from "../dto/users/updateUsers";
import { UserService } from "../service/userService";
import { validateInputSchemas } from "../validate/input";
import { UserRepository } from "./../repository/userRepository";

const userRouter = Router();
const userRepository = new UserRepository();
const userService = new UserService(userRepository);

userRouter.get("/", async (req: Request, res: Response) => {
  try {
    const params = req.query;
    const validateSearchParams = await validateInputSchemas(
      FilterUsersSchema,
      params
    );
    if (validateSearchParams.error) {
      res.status(400).send(validateSearchParams.errors);
      return validateSearchParams.errors;
    }
    const filteredUsers = await userService.findUsersByFilter(
      validateSearchParams.body
    );

    if (filteredUsers.length === 0) {
      res.status(404).send({ message: "Usuário(s) não encontrado(s)" });
      return { message: "Usuário(s) não encontrado(s)" };
    }
    res.status(200).send({ users: filteredUsers });
    return { users: filteredUsers };
  } catch (error: any) {
    res.status(500).send({
      status: 500,
      message: error.message,
    });
  }
});

userRouter.patch("/:id", async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);

    const validateUpdateUserBody = await validateInputSchemas(
      UpdateUsersSchema,
      req.body
    );
    if (validateUpdateUserBody.error) {
      res.status(400).send(validateUpdateUserBody.errors);
      return validateUpdateUserBody.errors;
    }
    const updatedUser = await userService.updateUser(
      userId,
      validateUpdateUserBody.body
    );
    res.status(200).send(updatedUser);
  } catch (error: any) {
    res.status(500).send({
      status: 500,
      message: error.message,
    });
  }
});
userRouter.get("/", async (req: Request, res: Response) => {
  try {
    const users = await userService.findAllUsers();
    res.status(200).send({ users: users });
    return users;
  } catch (error: any) {
    res.status(500).send({
      status: 500,
      message: error.message,
    });
  }
});
userRouter.post("/", async (req: Request, res: Response) => {
  try {
    const validateCreateUserBody = await validateInputSchemas(
      CreateUsersSchema,
      req.body
    );
    if (validateCreateUserBody.error) {
      res.status(400).send(validateCreateUserBody.errors);
      return validateCreateUserBody.errors;
    }
    const createdUser = await userService.createUser(
      validateCreateUserBody.body
    );

    if (createdUser.error) {
      res.status(400).send({ message: createdUser.message });
      return createdUser;
    }

    res.status(201).send(createdUser);
    return createdUser;
  } catch (error: any) {
    res.status(500).send({
      status: 500,
      message: error.message,
    });
  }
});

export default userRouter;
