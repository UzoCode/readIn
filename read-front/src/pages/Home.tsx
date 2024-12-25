import React, { useEffect, useState } from 'react';
import api from '../services/api';
import BookCard from '../components/BookCard.tsx';

const Home: React.FC = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    api.get('/books').then(response => setBooks(response.data));
  }, []);

  return (
    <div className="grid grid-cols-2 gap-4">
      {books.map((book: any) => (
        <BookCard key={book.id} title={book.title} author={book.author} />
      ))}
    </div>
  );
};

export default Home;