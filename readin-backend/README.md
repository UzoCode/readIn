# ReadIn Application

ReadIn is a web-based and mobile-friendly platform designed for users to explore, read, and manage books in an engaging and user-friendly environment. The application allows users to browse a bookstore, read books of interest, and maintain a personalized experience through user accounts and favorite book lists.

---

## Project Overview

ReadIn consists of:
- A **backend** built with NestJS and Prisma for robust API and database management.
- A **frontend** built with React and TypeScript, designed for a clean and intuitive user experience.
- A **SQLite** database for lightweight and efficient data storage.

---

## Features

### User Features
- **User Authentication:** Signup, login, and secure session management.
- **Bookstore:** Browse books categorized by genre, author, or title.
- **Favorites:** Add books to a personal favorites list.
- **Book Reader:** Read books with a responsive interface for seamless mobile and desktop experiences.

### Admin Features
- Manage books in the database (CRUD operations).
- View user activity and statistics.

---

## Technologies Used

### Backend:
- [NestJS](https://nestjs.com/): Framework for building scalable server-side applications.
- [Prisma](https://www.prisma.io/): ORM for database schema and queries.
- [SQLite](https://www.sqlite.org/index.html): Lightweight database solution.

### Frontend:
- [React](https://reactjs.org/): JavaScript library for building user interfaces.
- [TypeScript](https://www.typescriptlang.org/): For type-safe JavaScript development.
- [TailwindCSS](https://tailwindcss.com/): Utility-first CSS framework.

---

## Project Setup

### Prerequisites
- Node.js installed on your system.
- Basic knowledge of TypeScript and React.

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd readin-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Prisma**
   - Configure `prisma/schema.prisma` for your database.
   - Run database migration:
     ```bash
     npx prisma migrate dev --name init
     ```

4. **Seed the database**
   ```bash
   npx ts-node prisma/seed.ts
   ```

5. **Run the server**
   ```bash
   npm run start:dev
   ```

### Frontend Setup

1. **Navigate to the frontend directory**
   ```bash
   cd readin-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm start
   ```

---

## Folder Structure

### Backend:
```
readin-backend/
├── src/
│   ├── app.module.ts
│   ├── main.ts
│   ├── auth/
│   ├── books/
│   ├── users/
│   └── prisma/
│       └── seed.ts
├── prisma/
│   └── schema.prisma
├── package.json
└── tsconfig.json
```

### Frontend:
```
readin-frontend/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── App.tsx
│   └── index.tsx
├── tailwind.config.js
└── package.json
```

---

## API Endpoints

### User Authentication
- `POST /auth/signup`: Create a new user.
- `POST /auth/login`: Authenticate user and return a JWT token.

### Books
- `GET /books`: Fetch all books.
- `POST /books`: Add a new book (Admin only).
- `GET /books/:id`: Fetch a single book by ID.
- `PUT /books/:id`: Update book details (Admin only).
- `DELETE /books/:id`: Delete a book (Admin only).

---

## Deployment

### Backend Deployment
Use [Render](https://render.com) or [Railway](https://railway.app):
```bash
git init
git add .
git commit -m "Initial commit"
git push origin main
```

### Frontend Deployment
Use [Vercel](https://vercel.com):
```bash
npm run build
```

---

## Future Enhancements
- **Offline Reading Mode**: Allow users to download books for offline reading.
- **Dark Mode Support**: Add theme customization.
- **Social Features**: Allow users to share book reviews and recommendations.

---

## Author
Developed with 💻 Akosa Benedict, Full Stack Engineer ReadIn Team.
