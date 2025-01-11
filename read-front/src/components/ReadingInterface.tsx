import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Book } from '../../../shared/types'; // Adjust the import path as necessary

const ReadingInterface = ({ bookId }: { bookId: number }) => {
  const [book, setBook] = useState<Book | null>(null); // Specify the type here
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchBook = async () => {
      const response = await axios.get(`/books/${bookId}`);
      setBook(response.data);
      setProgress(response.data.readingProgress || 0); // Set initial progress
    };

    fetchBook();
  }, [bookId]);

  const handleProgressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = Number(event.target.value); // Convert to number
    setProgress(newProgress);
  };

  const saveProgress = async () => {
    await axios.patch(`/books/${bookId}/progress`, { progress });
    alert('Reading progress saved!');
  };

  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{book.title}</h1>
      <h2>By {book.author}</h2>
      <div>
        <p>{book.content}</p>
      </div>
      <div>
        <label>
          Reading Progress:
          <input
            type="number"
            value={progress}
            onChange={handleProgressChange}
            min="0"
            max={book.content.length} // Assuming content length represents total pages/length
          />
        </label>
        <button onClick={saveProgress}>Save Progress</button>
      </div>
    </div>
  );
};

export default ReadingInterface;