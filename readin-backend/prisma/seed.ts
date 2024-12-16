import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create Users
  const user = await prisma.user.create({
    data: {
      username: "johndoe",
      email: "john@example.com",
      password: "securepassword",
    },
  });

  // Create Books
  const book1 = await prisma.book.create({
    data: {
      title: "Book 1",
      author: "Author 1",
      category: "Fiction",
      content: "Lorem ipsum...",
    },
  });

  const book2 = await prisma.book.create({
    data: {
      title: "Book 2",
      author: "Author 2",
      category: "Science",
      content: "Lorem ipsum...",
    },
  });

  // Create Favorite Relationships
  await prisma.userBook.createMany({
    data: [
      { userId: user.id, bookId: book1.id },
      { userId: user.id, bookId: book2.id },
    ],
  });
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
