/// <reference types="next" />
/// <reference types="next/image-types/global" />

// CSS Module declarations
declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}

declare module '*.scss' {
  const content: Record<string, string>;
  export default content;
}

declare module '*.mp4' {
  const src: string;
  export default src;
}

