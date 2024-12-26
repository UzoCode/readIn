import React, { useEffect, useState } from "react";
import apiClient from "../api/axios.ts";

interface Book {
  id: number;
  title: string;
  author: string;
  genre: string; // Assuming each book has a 'genre' property
}

const BooksList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [genreFilter, setGenreFilter] = useState<string>("All");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await apiClient.get("/books");
        setBooks(response.data); // Assuming response.data contains the list of books
        setFilteredBooks(response.data);
      } catch (err: any) {
        setError("Failed to fetch books. Please try again.");
      }
    };

    fetchBooks();
  }, []);

  // Update filtered books when genre filter changes
  useEffect(() => {
    if (genreFilter === "All") {
      setFilteredBooks(books);
    } else {
      setFilteredBooks(books.filter((book) => book.genre === genreFilter));
    }
  }, [genreFilter, books]);

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setGenreFilter(event.target.value);
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Books List</h1>

      {/* Filter Section */}
      <div className="mb-6">
        <label htmlFor="genreFilter" className="mr-2 font-semibold">
          Filter by Genre:
        </label>
        <select
          id="genreFilter"
          value={genreFilter}
          onChange={handleFilterChange}
          className="border border-gray-400 rounded p-2"
        >
          <option value="All">All</option>
          <option value="Fiction">Fiction</option>
          <option value="Non-Fiction">Non-Fiction</option>
          {/* Add more genres dynamically if available */}
        </select>
      </div>

      {/* Book List */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBooks.map((book) => (
          <li key={book.id} className="border p-4 rounded shadow-sm hover:shadow-md transition-shadow">
            <h2 className="font-bold text-lg">{book.title}</h2>
            <p className="text-gray-700">by {book.author}</p>
            <p className="text-sm text-gray-500">Genre: {book.genre}</p>
          </li>
        ))}
      </ul>

      {filteredBooks.length === 0 && <p className="text-gray-500 mt-4">No books found for the selected genre.</p>}
    </div>
  );
};

export default BooksList;
