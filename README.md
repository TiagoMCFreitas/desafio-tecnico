# API REST - Teste Técnico

Este projeto é uma API RESTful desenvolvida em **Node.js** com **TypeScript**, seguindo boas práticas de arquitetura em camadas. A API gerencia recursos de usuários e criptomoedas, realizando operações CRUD com validações robustas usando **Zod** e persistência de dados com **Prisma ORM** conectado a um banco de dados **PostgreSQL**.

Neste repositório temos 2 projetos, o primeiro que será apresentado, refere-se a **api de consumo dos dados de usuários e criptomoedas**

## Pasta - App (Api de cosumo de usuários e criptomoedas)

## 🔧 Tecnologias utilizadas

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Prisma ORM](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Zod](https://github.com/colinhacks/zod)
- [Docker](https://www.docker.com/)
- [Swagger](https://swagger.io/) - Documentação interativa da API

## 📁 Estrutura do Projeto (app)

src/

├── controller
│   ├── cryptoCurrencyController.ts
│   └── userController.ts
├── docs
│   └── swagger.ts
├── dto
│   ├── cryptoCurrency
│   │   ├── filterCryptoCurrency.ts
│   │   └── orderCryptoCurrency.ts
│   └── users
│       ├── createUsers.ts
│       ├── filterUsers.ts
│       └── updateUsers.ts
├── index.ts
├── repository
│   ├── cryptoCurrencyRepository.ts
│   └── userRepository.ts
├── service
│   ├── cryptoCurrencyService.ts
│   └── userService.ts
├── tests
│   ├── controller
│   │   ├── cryptoCurrencyController.test.ts
│   │   └── userController.test.ts
│   ├── repository
│   │   ├── cryptoCurrencyRepository.test.ts
│   │   └── userRepository.test.ts
│   └── service
│       ├── cryptoCurrencyService.test.ts
│       └── userService.test.ts
├── utils
│   └── database
│       └── index.ts
└── validate
    └── input
        └── index.ts

## 📚 O projeto (Explicações e informações)

### 1. Estrutura

* **Controller:** Recebe requisições e interage com os serviços.
* **Service:** Contém as regras de negócio e manipulação dos dados.
* **Repository:** Responsável por consultar o banco de dados via Prisma.
* **DTO:** Define os tipos de dados de entrada da API.
* **Validation:** Usa Zod para validar os dados recebidos.
* **Utils:** Conexão com banco e ferramentas auxiliares.

### 2. Funcionalidades

A API fornece funcionalidades para gerenciamento de **usuários** e  **criptomoedas** , incluindo criação, atualização, filtragem e ordenação. As operações estão organizadas em dois grupos principais:

---

### 🔐 Usuários (`/users`)

* **🔎 Listar usuários**
  * Rota: `GET /users`
  * Filtra usuários por: `id`, `name`, `email`, `role`.
  * Retorna uma lista de usuários conforme os parâmetros de busca.
* **➕ Criar novo usuário**
  * Rota: `POST /users`
  * Requer um corpo JSON com os campos obrigatórios para criação (`name`, `email`, `role`, etc).
  * Retorna o usuário criado.
* **✏️ Atualizar usuário**
  * Rota: `PATCH /users/{id}`
  * Atualiza os dados de um usuário específico com base no `id` informado.
  * Requer um corpo JSON com os campos a serem modificados.

---

### 🪙 Criptomoedas (`/cryptos`)

* **🔎 Listar criptomoedas filtradas**
  * Rota: `GET /cryptos`
  * Permite filtrar por: `id`, `name`, `offset`, `limit`.
  * Retorna criptomoedas conforme os filtros fornecidos.
* **📊 Listar criptomoedas ordenadas**
  * Rota: `GET /cryptos/order`
  * Permite ordenar dinamicamente por:
    * `currentPrice`
    * `marketCap`
    * `percentPriceChange24h`
    * `percentPriceChange7D`
    * `ath` (All Time High)
    * `atl` (All Time Low)
    * `id`
    * `name`
  * Cada campo pode ser ordenado em ordem crescente (`asc`) ou decrescente (`desc`).
  * Suporta também paginação com `offset` e `limit`.

## 🚀 Executando o projeto (Desenvolvimento e testes)

### 1. Clone o repositório

```bash
git clone git@github.com:TiagoMCFreitas/desafio-tecnico-truther.git
cd desafio-tecnico-truther
cd app

npm install
```

### 2. Configure o banco de dados

Crie um arquivo `.env` com a seguinte variável:

DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres"

### 3. Gere o client do Prisma e aplique as migrações

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 4. Rode o servidor

```bash
npm run dev
```

## Pasta - syncservice (serviço de sincronização da api (CoinGecko) para o banco de dados)

## 🔧 Tecnologias utilizadas

- [Node.js](https://nodejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Prisma ORM](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Docker](https://www.docker.com/)

## 📁 Estrutura do Projeto (app)

src/

├── api
│   ├── get
│   │   └── index.ts
│   └── @types
│       └── coinsMarket.ts
├── db
│   └── insert
│       └── index.ts
├── index.ts
└── utils
    ├── database
    │   └── index.ts
    └── timeSleep.ts

## 📚 O projeto (Explicações e informações)

Este projeto é um job automatizado que consome dados do mercado de criptomoedas via [CoinGecko API](https://www.coingecko.com/), formata os dados relevantes e os armazena em um banco de dados PostgreSQL usando o Prisma ORM. O processo é repetido automaticamente a cada 5 minutos.

O processo é capaz de resistir ao limite de api imposto, dessa forma, por mais que demore algum tempo a mais, o processo não é perdido, resultando sempre na obtenção completa dos dados, a api tem o limite de 30 requisições por minuto, o código é capaz de entender essa limitação e espera o quanto precisar para começar a rodar novamente

## ⚙️ Como Funciona

1. A aplicação realiza requisições paginadas para a CoinGecko API.
2. Cada item retornado é mapeado e formatado em um modelo consistente.
3. Os dados são inseridos no banco de dados após exclusão completa da tabela (`deleteMany()`).
4. O processo aguarda 5 minutos (`300000 ms`) e se repete.

## 📦 Instalação

### Pré-requisitos

- Node.js v20.19.4
- PostgreSQL rodando localmente ou via Docker
- API Key da CoinGecko (gratuita com registro)

## 🚀 Executando o projeto (Desenvolvimento e testes)

### 1. Clone o repositório

```bash
git clone git@github.com:TiagoMCFreitas/desafio-tecnico-truther.git
cd desafio-tecnico-truther
cd syncservice

npm install
```

### 2. Configure o banco de dados

Crie um arquivo `.env` com a seguinte variável:

DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres"

### 3. Gere o client do Prisma e aplique as migrações

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 4. Rode o servidor

```bash
npm run dev
```


## Rodando o servidor em produção

Primeiramente, vá no arquivo .github/workflows/deploy.yml

* Adeque a linha **22** para a estrutura de pastas do servidor que deseja fazer o deploy

```yaml
name: Deploy no Servidor Walle

on:
  push:
    branches:
      - main # altere se sua branch for diferente

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Acessar o servidor e rodar build + deploy
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          port: ${{ secrets.SERVER_SSH_PORT }}
          script: |
            cd projetos/rodarDesafioTecnicoTruther
            bash buildImages.sh
            docker compose up -d

```

* Após isso, configure no repositório no github em Settings/ Secrets and variables e configure as variáveis secretas referente ao servidor de deploy
* Em seguida, entre no servidor e clone o projeto [rodarDesafioTecnicoTruther](https://github.com/TiagoMCFreitas/rodarDesafioTecnicoTruther) para dentro da sua pasta (certifique-se que o docker e o dokcer-compose estão instalados)
* Crie os arquivos .envApp e .envSync
* Em .envApp

  ```
  DATABASE_URL="postgresql://postgres:postgres@hostservidor:portabanco/desafio_tecnico_truther"
  ```
* Em .envSync

  ```
  COINGECKO_API_KEY="CoinGeckoApiKey"
  DATABASE_URL="postgresql://postgres:postgres@hostservidor:portabanco/desafio_tecnico_truther"

  ```
* Com essa estrutura pronta, basta realizar um commit no github para iniciar o projeto, porém, é possível realizar o start por meio dos comandos abaixo:
* Entre na pasta do projeto e rode o seguinte comando **bash buildImages.sh** (Este arquivo irá criar as imagens referentes aos dois projetos citados acima, com todas as dependencias instaladas)
* Após o comando rodar, rode docker compose up -d e o projeto estará rodando (Se é a primeira vez que o projeto é executado, o banco das criptomoedas estará vazio, porém o script estará rodando em por volta de 2 minutos todos os dados estarão presentes para consultas e filtros)

## Projeto Online rodando

* Url: [https://apicrypto.tigasolutions.com.br]()
* Docs: [https://apicrypto.tigasolutions.com.br/docs]()
