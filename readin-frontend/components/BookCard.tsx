import React from 'react';

type BookCardProps = {
  title: string;
  author: string;
};

const BookCard: React.FC<BookCardProps> = ({ title, author }) => (
  <div className="p-4 border rounded shadow">
    <h3>{title}</h3>
    <p>{author}</p>
  </div>
);

export default BookCard;