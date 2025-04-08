declare module 'gif.js' {
  interface GIFOptions {
    workers?: number;
    repeat?: number;
    background?: string;
    quality?: number;
    width?: number;
    height?: number;
    transparent?: string | null;
    debug?: boolean;
    dither?: boolean;
    workerScript?: string;
    delay?: number;
    dispose?: number;
  }

  interface GIFFrameOptions {
    delay?: number;
    copy?: boolean;
    dispose?: number;
  }

  class GIF {
    constructor(options?: GIFOptions);
    addFrame(frame: HTMLImageElement | HTMLCanvasElement | ImageData, options?: GIFFrameOptions): void;
    on(event: 'finished', callback: (blob: Blob) => void): void;
    on(event: 'progress', callback: (progress: number) => void): void;
    on(event: string, callback: (...args: any[]) => void): void;
    render(): void;
    abort(): void;
  }

  export = GIF;
} 