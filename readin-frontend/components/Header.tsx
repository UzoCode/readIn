import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-blue-600 text-white py-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          <Link to="/">ReadIn</Link>
        </h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link to="/login" className="hover:underline">
                Login
              </Link>
            </li>
            <li>
              <Link to="/reader" className="hover:underline">
                Reader
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
