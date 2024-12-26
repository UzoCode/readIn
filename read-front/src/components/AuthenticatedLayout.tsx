import React from "react";
import { Outlet } from "react-router-dom";

const AuthenticatedLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">ReadIn</h1>
          <nav>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/login"; // Redirect to login on logout
              }}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto p-4">
        <Outlet /> {/* Renders child routes */}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-4">
        <p>&copy; 2024 ReadIn. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AuthenticatedLayout;
