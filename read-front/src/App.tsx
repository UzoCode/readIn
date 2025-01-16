// App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import BookList from "./components/BooksList.tsx"; // Ensure this is the correct path
import BookDetails from "./components/BookDetails.tsx"; // Import the BookDetails component
import Signup from "./components/Signup.tsx";
import Login from "./components/Login.tsx";
import AuthenticatedLayout from "./components/AuthenticatedLayout.tsx";
import UploadBook from "./components/UploadBook.tsx"; // Import the UploadBook component

const isAuthenticated = () => !!localStorage.getItem("token");

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AuthenticatedLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<BookList />} />
          <Route path="books/:id" element={<BookDetails />} />
          <Route path="upload" element={<UploadBook />} /> {/* Add route for UploadBook */}
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
