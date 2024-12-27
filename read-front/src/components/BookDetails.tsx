import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams from react-router-dom
import apiClient from "../api/axios.ts"; // Adjust the import based on your project structure
import { Book } from '../env'; // Import the Book type from env.d.ts

const BookDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [book, setBook] = useState<Book | null>(null);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchBook = async () => {
        try {
          const response = await apiClient.get(`/books/${id}`);
          setBook(response.data);
        } catch (err: any) {
          setError("Failed to fetch book details. Please try again.");
        }
      };
  
      fetchBook();
    }, [id]);
  
    if (error) {
      return <div>{error}</div>;
    }
  
    if (!book) {
      return <div>Loading...</div>;
    }
  
    return (
      <div className="p-4">
        <h1 className="text-4xl font-bold mb-4">{book.title}</h1>
        <h2 className="text-2xl font-semibold mb-2">by {book.author}</h2>
        <p className="text-gray-700 italic mb-4">Genre: {book.genre}</p>
        <div className="bg-gray-100 p-4 rounded shadow-md">
          <a
            href={book.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            Open Book
          </a>
        </div>
      </div>
    );
};

export default BookDetails; // Ensure you have this line