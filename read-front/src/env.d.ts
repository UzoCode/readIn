declare namespace NodeJS {
  interface ProcessEnv {
    REACT_APP_BACKEND_URL: string;
  }
}

// Declare module for SVG files
declare module '*.svg' {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}

// Declare the Book interface
export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  fileUrl: string;
}