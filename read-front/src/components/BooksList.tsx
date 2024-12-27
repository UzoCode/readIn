import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import apiClient from "../api/axios.ts";
import UploadBook from "./UploadBook.tsx"; // Import UploadBook component

interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
}

const BooksList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [genreFilter, setGenreFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showUpload, setShowUpload] = useState<boolean>(false); // State to toggle upload form
  const booksPerPage = 5;

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

  useEffect(() => {
    let updatedBooks = books;

    if (genreFilter !== "All") {
      updatedBooks = updatedBooks.filter((book) => book.genre === genreFilter);
    }

    if (searchQuery) {
      updatedBooks = updatedBooks.filter(
        (book) =>
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredBooks(updatedBooks);
    setCurrentPage(1);
  }, [genreFilter, searchQuery, books]);

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-4">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Books List</h1>
        <button
          onClick={() => setShowUpload((prev) => !prev)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          {showUpload ? "Close Upload" : "Upload a Book"}
        </button>
      </header>

      {showUpload && (
        <div className="mb-6">
          <UploadBook />
        </div>
      )}

      <div className="mb-6">
        <label htmlFor="searchQuery" className="mr-2 font-semibold">
          Search:
        </label>
        <input
          type="text"
          id="searchQuery"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-400 rounded p-2"
          placeholder="Search by title or author"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="genreFilter" className="mr-2 font-semibold">
          Filter by Genre:
        </label>
        <select
          id="genreFilter"
          value={genreFilter}
          onChange={(e) => setGenreFilter(e.target.value)}
          className="border border-gray-400 rounded p-2"
        >
          <option value="All">All</option>
          <option value="Fiction">Fiction</option>
          <option value="Non-Fiction">Non-Fiction</option>
        </select>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentBooks.map((book) => (
          <li
            key={book.id}
            className="border p-4 rounded shadow-sm hover:shadow-md transition-shadow"
          >
            <h2 className="font-bold text-lg">{book.title}</h2>
            <p className="text-gray-700">by {book.author}</p>
            <p className="text-sm text-gray-500">Genre: {book.genre}</p>
            <Link
              to={`/books/${book.id}`}
              className="text-blue-500 hover:underline mt-2 block"
            >
              Read More
            </Link>
          </li>
        ))}
      </ul>

      {currentBooks.length === 0 && (
        <p className="text-gray-500 mt-4">No books found matching your criteria.</p>
      )}

      <div className="flex justify-center items-center mt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded mx-1 disabled:opacity-50"
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`px-3 py-1 border rounded mx-1 ${
              currentPage === index + 1 ? "bg-gray-200" : ""
            }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded mx-1 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BooksList;
