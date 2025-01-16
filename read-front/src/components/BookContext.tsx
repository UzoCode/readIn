// BookContext.tsx
import React, { createContext, useState, useContext } from 'react';

// Define the Book interface
interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
}

// Define the context type
interface BookContextType {
  books: Book[];
  addBook: (book: Book) => void;
}

// Create a context with a default value of undefined
const BookContext = createContext<BookContextType | undefined>(undefined);

// Create a provider component
export const BookProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([]); // State to hold the list of books

  // Function to add a new book
  const addBook = (book: Book) => {
    setBooks((prevBooks) => [...prevBooks, book]);
  };

  return (
    <BookContext.Provider value={{ books, addBook }}>
      {children}
    </BookContext.Provider>
  );
};

// Custom hook to use the BookContext
export const useBooks = () => {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error("useBooks must be used within a BookProvider");
  }
  return context;
};