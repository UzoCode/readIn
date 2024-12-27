const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const books = await prisma.book.findMany();
  console.log('Books:', books);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
