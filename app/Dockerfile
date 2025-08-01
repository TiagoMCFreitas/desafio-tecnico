FROM node:20.18.0
WORKDIR /app
COPY package.json .
COPY . .
RUN npm install
RUN npm i sharp
RUN npm run build
RUN npx prisma generate
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]

