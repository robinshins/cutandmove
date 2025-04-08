declare module 'gifshot' {
  interface GifShotOptions {
    images: string[];
    gifWidth?: number;
    gifHeight?: number;
    numFrames?: number;
    frameDuration?: number;
    interval?: number;
    progressCallback?: (captureProgress: number) => void;
    completeCallback?: () => void;
    numWorkers?: number;
    fontSize?: string;
    fontWeight?: string;
    fontFamily?: string;
    fontColor?: string;
    textAlign?: string;
    textBaseline?: string;
    sampleInterval?: number;
    text?: string;
    textXCoordinate?: number;
    textYCoordinate?: number;
    waterMark?: any;
    waterMarkXCoordinate?: number;
    waterMarkYCoordinate?: number;
    waterMarkHeight?: number;
    waterMarkWidth?: number;
    crossOrigin?: string;
  }

  interface GifResult {
    error: boolean | any;
    errorCode?: string;
    errorMsg?: string;
    image?: string;
  }

  function createGIF(
    options: GifShotOptions,
    callback: (result: GifResult) => void
  ): void;

  export { createGIF };
  export default { createGIF };
} 