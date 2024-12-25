import React from "react";
import "./App.css";
import BookList from "./components/BooksList.tsx";
import Signup from "./components/Signup.tsx";
import Login from "./components/Login.tsx";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to ReadIn</h1>
      </header>
      <main>
        <section>
          <h2>Sign Up</h2>
          <Signup />
        </section>
        <section>
          <h2>Login</h2>
          <Login />
        </section>
        <section>
          <h2>Book List</h2>
          <BookList />
        </section>
      </main>
      <footer className="App-footer">
        <p>&copy; 2024 ReadIn. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
