declare namespace NodeJS {
  interface ProcessEnv {
    REACT_APP_BACKEND_URL: string;
  }
}

declare module '*.svg' {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}
