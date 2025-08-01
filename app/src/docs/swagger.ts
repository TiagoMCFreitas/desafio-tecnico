import {
  OpenApiGeneratorV3,
  OpenAPIRegistry,
} from "@asteasolutions/zod-to-openapi";

// Import dos schemas de usuários
import { CreateUsersSchema } from "../dto/users/createUsers";
import { FilterUsersSchema } from "../dto/users/filterUsers";
import { UpdateUsersSchema } from "../dto/users/updateUsers";

// Import dos schemas de criptomoedas
import { FilterCryptoCurrencySchema } from "../dto/cryptoCurrency/filterCryptoCurrency";
import { OrderCryptoCurrencySchema } from "../dto/cryptoCurrency/orderCryptoCurrency";

// Registrar todos os schemas
export const registry = new OpenAPIRegistry();

registry.register("CreateUser", CreateUsersSchema);
registry.register("FilterUser", FilterUsersSchema);
registry.register("UpdateUser", UpdateUsersSchema);

registry.register("FilterCryptoCurrency", FilterCryptoCurrencySchema);
registry.register("OrderCryptoCurrency", OrderCryptoCurrencySchema);

// Gerar os schemas (components)
const generator = new OpenApiGeneratorV3(registry.definitions);

const baseDoc = generator.generateDocument({
  openapi: "3.0.0",
  info: {
    title: "API de Usuários e Criptomoedas",
    version: "1.0.0",
    description:
      "API para gerenciamento de usuários e criptomoedas com filtros e ordenações",
  },
  tags: [
    { name: "Users", description: "Endpoints relacionados a usuários" },
    { name: "Cryptos", description: "Endpoints relacionados a criptomoedas" },
  ],
});

// Definição manual dos paths, separando usuários e criptos

export const openApiDocument = {
  ...baseDoc,
  paths: {
    // ----------- USERS --------------
    "/users": {
      get: {
        summary: "Lista todos os usuários",
        tags: ["Users"],
        parameters: [
          {
            name: "id",
            in: "query",
            description: "O id do usuário dentro da base de dados",
            required: false,
            schema: {
              type: "string",
            },
          },
          {
            name: "name",
            in: "query",
            description: "O nome do usuário dentro da base de dados",
            required: false,
            schema: {
              type: "string",
            },
          },
          {
            name: "email",
            in: "query",
            description: "O email do usuário dentro da base de dados",
            required: false,
            schema: {
              type: "string",
            },
          },
          {
            name: "role",
            in: "query",
            description: "A função do usuário dentro da base de dados",
            required: false,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "Lista de usuários",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    users: {
                      type: "array",
                      items: { $ref: "#/components/schemas/FilterUser" },
                    },
                  },
                },
              },
            },
          },
          500: { description: "Erro interno do servidor" },
        },
      },
      post: {
        summary: "Cria um novo usuário",
        tags: ["Users"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateUser" },
            },
          },
        },
        responses: {
          201: {
            description: "Usuário criado com sucesso",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreateUser" },
              },
            },
          },
          400: { description: "Dados inválidos" },
          500: { description: "Erro interno do servidor" },
        },
      },
    },

    "/users/{id}": {
      patch: {
        summary: "Atualiza um usuário pelo ID",
        tags: ["Users"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "ID do usuário",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateUser" },
            },
          },
        },
        responses: {
          200: {
            description: "Usuário atualizado com sucesso",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UpdateUser" },
              },
            },
          },
          400: { description: "Dados inválidos" },
          500: { description: "Erro interno do servidor" },
        },
      },
    },

    "/cryptos": {
      get: {
        summary: "Lista criptomoedas filtradas",
        tags: ["Cryptos"],
        description: `Filtre os resultados por 'id' ou 'name' usando query params. 
        Exemplo: ?id=maya-preferred-223 ou ?name=Maya Preferred PRA`,
        parameters: [
          {
            name: "id",
            in: "query",
            schema: { type: "string" },
            description: "Filtra por id da criptomoeda",
            required: false,
          },
          {
            name: "name",
            in: "query",
            schema: { type: "string" },
            description: "Filtra por nome da criptomoeda",
            required: false,
          },
          {
            name: "offset",
            in: "query",
            schema: { type: "string" },
            description: "Define o offset da consulta de criptomoedas",
            required: false,
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "string" },
            description: "Define o limit da consulta de criptomoedas (max 200)",
            required: false,
          },
        ],
        responses: {
          "200": {
            description: "Lista de criptomoedas filtradas",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/FilterCryptoCurrency" },
                },
              },
            },
          },
          "400": { description: "Parâmetros inválidos" },
          "500": { description: "Erro no servidor" },
        },
      },
    },
    "/cryptos/order": {
      get: {
        summary: "Lista criptomoedas ordenadas dinamicamente",
        tags: ["Cryptos"],
        parameters: [
          {
            name: "currentPrice",
            in: "query",
            description: "Direção da ordenação para currentPrice (asc ou desc)",
            required: false,
            schema: {
              type: "string",
              enum: ["asc", "desc"],
            },
          },
          {
            name: "marketCap",
            in: "query",
            description: "Direção da ordenação para marketCap (asc ou desc)",
            required: false,
            schema: {
              type: "string",
              enum: ["asc", "desc"],
            },
          },
          {
            name: "percentPriceChange24h",
            in: "query",
            description:
              "Direção da ordenação para percentPriceChange24h (asc ou desc)",
            required: false,
            schema: {
              type: "string",
              enum: ["asc", "desc"],
            },
          },
          {
            name: "percentPriceChange7D",
            in: "query",
            description:
              "Direção da ordenação para percentPriceChange7D (asc ou desc)",
            required: false,
            schema: {
              type: "string",
              enum: ["asc", "desc"],
            },
          },
          {
            name: "ath",
            in: "query",
            description: "Direção da ordenação para ath (asc ou desc)",
            required: false,
            schema: {
              type: "string",
              enum: ["asc", "desc"],
            },
          },
          {
            name: "atl",
            in: "query",
            description: "Direção da ordenação para atl (asc ou desc)",
            required: false,
            schema: {
              type: "string",
              enum: ["asc", "desc"],
            },
          },
          {
            name: "id",
            in: "query",
            description: "Direção da ordenação para id (asc ou desc)",
            required: false,
            schema: {
              type: "string",
              enum: ["asc", "desc"],
            },
          },
          {
            name: "name",
            in: "query",
            description: "Direção da ordenação para name (asc ou desc)",
            required: false,
            schema: {
              type: "string",
              enum: ["asc", "desc"],
            },
          },
          {
            name: "offset",
            in: "query",
            schema: { type: "string" },
            description: "Define o offset da consulta de criptomoedas",
            required: false,
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "string" },
            description: "Define o limit da consulta de criptomoedas (max 200)",
            required: false,
          },
        ],
        responses: {
          200: {
            description: "Lista ordenada de criptomoedas",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/OrderCryptoCurrency" },
                },
              },
            },
          },
          400: { description: "Parâmetros inválidos" },
          500: { description: "Erro interno do servidor" },
        },
      },
    },
  },
};
