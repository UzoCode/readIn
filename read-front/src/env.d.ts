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

// Declare module for epub-gen
declare module 'epub-gen' {
  interface EpubOptions {
    title: string;
    author: string;
    content: Array<{ title: string; data: string }>;
    // Add other options as needed
  }

  export default class Epub {
    constructor(options: EpubOptions);
    generate(outputPath: string): Promise<void>;
  }
}
