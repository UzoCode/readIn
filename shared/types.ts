export interface Book {
    id: number;
    title: string;
    author: string;
    content: string; // Required field
    category: string; // Required field
    genre: string | null | undefined; // Allow both null and undefined
    filePath: string | null | undefined; // Same adjustment for filePath
    readingProgress?: number; // Optional field for reading progress
  }