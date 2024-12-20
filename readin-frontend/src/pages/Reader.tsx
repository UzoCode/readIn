import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Reader: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('You must log in to access this page.');
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white py-4 text-center">
        <h1 className="text-3xl font-bold">Reader</h1>
      </header>
      <main className="container mx-auto p-4">
        <p className="text-lg">
          Welcome to the Reader page! Content will be displayed here.
        </p>
      </main>
    </div>
  );
};

export default Reader;
