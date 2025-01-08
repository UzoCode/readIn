import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create a sample user
  const user = await prisma.user.create({
    data: {
      username: 'Uzo',
      email: 'akosabenedict@gmail.com',
      password: 'password123',
    },
  });

  // Create a sample book
  const book = await prisma.book.create({
    data: {
      title: 'Sample Book',
      author: 'Author Name',
      content: 'This is a sample book content.',
      category: 'Fiction',
    },
  });

  console.log({ user, book });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
