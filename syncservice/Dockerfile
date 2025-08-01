FROM node:20.18.0
WORKDIR /app
COPY package.json .
COPY . .
RUN npm install
RUN npm i sharp
RUN npm run build
RUN npx prisma generate
CMD ["npm","run","start"]
