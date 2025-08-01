import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  await prisma.users.createMany({
    data: [
      {
        name: "Admin User",
        email: "admin@example.com",
        password: await bcrypt.hash("admin123", 10), // idealmente, você deve hashear a senha
        role: "admin",
      },
      {
        name: "John Doe",
        email: "john@example.com",
        password: await bcrypt.hash("admin123", 10),
        role: "user",
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        password: await bcrypt.hash("admin123", 10),
        role: "user",
      },
    ],
    skipDuplicates: true, // evita erro se o seed for rodado mais de uma vez
  });
}

main()
  .then(() => {
    console.log("✅ Seed concluído");
  })
  .catch((e) => {
    console.error("❌ Erro ao executar o seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
