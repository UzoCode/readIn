import React, { useState } from "react";
import apiClient from "../api/axios.ts";
import { FaCloudUploadAlt } from "react-icons/fa"; // Importing the upload icon

const UploadBook: React.FC = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  const extractMetadata = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await apiClient.post("/books/extract-metadata", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data; // Metadata from the backend
    } catch (error) {
      console.error("Metadata extraction failed:", error);
      throw new Error("Failed to extract metadata");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);

    if (selectedFile) {
      try {
        const metadata = await extractMetadata(selectedFile);
        setTitle(metadata.title || "");
        setAuthor(metadata.author || "");
        setGenre(metadata.genre || "");
      } catch {
        setMessage("Failed to extract metadata. Please try again.");
      }
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("author", author);
    formData.append("genre", genre);

    try {
      await apiClient.post("/books/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage("File uploaded successfully!");
    } catch (err) {
      setMessage("Failed to upload file. Please try again.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>Upload a Book</h1>
      <form onSubmit={handleUpload}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label>Author:</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>
        <div>
          <label>Genre:</label>
          <input
            type="text"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          />
        </div>
        <div>
          <label>File:</label>
          <input
            type="file"
            accept=".pdf,.epub"
            onChange={handleFileChange}
          />
        </div>
        <button
          type="submit"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            padding: "10px 20px",
            background: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          <FaCloudUploadAlt size={20} />
          Upload
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UploadBook;
