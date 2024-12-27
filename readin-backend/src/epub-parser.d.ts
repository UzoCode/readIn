
// Declare module for epub-parser
declare module 'epub-parser' {
    interface Metadata {
      title?: string;
      creator?: string;
      description?: string;
      language?: string;
      // Add other metadata fields as needed
    }
  
    function parseBuffer(buffer: Buffer, callback: (err: Error | null, metadata: Metadata) => void): void;
  
    export { parseBuffer };
  }
  
  // Declare Buffer if not using Node.js types
  declare global {
    interface Buffer {
      // Define any methods or properties you need
    }
  }