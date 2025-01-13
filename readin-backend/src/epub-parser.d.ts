// Declare module for epub-parser
declare module 'epub-parser' {
  interface Metadata {
    title?: string;
    creator?: string;
    description?: string;
    language?: string;
    subject?: string;
    // Add other metadata fields as needed
  }

  interface EpubData {
    metadata: Metadata;
    // Add any other properties you expect from the parsed EPUB data
  }

  export function parse(filePath: string): Promise<EpubData>;
}
