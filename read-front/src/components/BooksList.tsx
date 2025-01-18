// BooksList.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import { useBooks } from "./BookContext.tsx"; // Import useBooks hook
import UploadBook from "./UploadBook.tsx"; // Ensure this path is correct

interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
}

const BooksList: React.FC = () => {
  const { books } = useBooks(); // Get books from context
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [error, setError] = useState<string | null>(null); // State for error handling
  const [genreFilter, setGenreFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showUpload, setShowUpload] = useState<boolean>(false); // State to toggle upload form
  const booksPerPage = 5;

  useEffect(() => {
    // Check if books are available
    if (books.length === 0) {
      setError("No books available."); // Set error if no books are found
    } else {
      setError(null); // Clear error if books are available
    }

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

      {error && <div className="text-red -500 mb-4">{error}</div>} {/* Display error message */}

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
          <option value="Science">Science</option>
          <option value="Fantasy">Fantasy</option>
          <option value="Biography">Biography</option>
        </select>
      </div>

      <ul className="list-disc pl-5">
        {currentBooks.map((book) => (
          <li key={book.id} className="mb-2"> {/* Updated key prop */}
            <Link to={`/books/${book.id}`} className="text-blue-500 hover:underline">
              {book.title} by {book.author}
            </Link>
          </li>
        ))}
      </ul>

      <div className="flex justify-between mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BooksList;