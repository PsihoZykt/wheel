/// <reference types="vite-plugin-svgr/client" />
/// <reference types="vite/client" />

declare module '*.mp3' {
  const src: string;
  export default src;
}
