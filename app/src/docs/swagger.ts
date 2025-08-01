import {
  OpenApiGeneratorV3,
  OpenAPIRegistry,
} from "@asteasolutions/zod-to-openapi";
import { CreateUsersSchema } from "../dto/users/createUsers";
import { FilterUsersSchema } from "../dto/users/filterUsers";
import { UpdateUsersSchema } from "../dto/users/updateUsers";

export const registry = new OpenAPIRegistry();

registry.register("CreateUser", CreateUsersSchema);
registry.register("FilterUsers", FilterUsersSchema);
registry.register("UpdateUser", UpdateUsersSchema);

const generator = new OpenApiGeneratorV3(registry.definitions);

export const openApiDocument = generator.generateDocument({
  openapi: "3.0.0",
  info: {
    title: "User API",
    version: "1.0.0",
  },
  // você pode deixar vazio se só quiser os schemas
});
