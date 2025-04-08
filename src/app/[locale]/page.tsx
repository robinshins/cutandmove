"use client";

import { useState, useRef, useEffect } from "react";
import gifshot from "gifshot";
import GIF from "gif.js";
import { useTranslations } from 'next-intl';
import { NextIntlClientProvider } from 'next-intl';
import { useParams } from 'next/navigation';

// 위치 조정을 위한 인터페이스
interface PositionAdjustment {
  x: number;
  y: number;
}

// 객체 경계 상자 인터페이스
interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

// 클라이언트 메시지 래퍼 컴포넌트
function HomeContent() {
  const t = useTranslations('app');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [gridImages, setGridImages] = useState<string[]>([]);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detectedObjects, setDetectedObjects] = useState<BoundingBox[]>([]);
  const [threshold, setThreshold] = useState(1); // 배경 색상 임계값을 1로 설정
  const [showOptions, setShowOptions] = useState(false); // 옵션 접힘 상태 관리
  const [frameDelay, setFrameDelay] = useState(300); // 프레임 간 지연 시간 (ms)
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadedImageRef = useRef<string | null>(null);
  const [isDragging, setIsDragging] = useState(false); // 드래그 중인지 상태 추가
  const animationPreviewRef = useRef<HTMLDivElement>(null); // 애니메이션 미리보기 영역에 대한 ref 추가
  
  // 임계값 변경 시 이미지 재처리
  useEffect(() => {
    // 이미지가 있을 때만 처리
    if (uploadedImageRef.current) {
      const img = new Image();
      img.onload = () => {
        processImageWithObjectDetection(null, img);
      };
      img.onerror = () => {
        setError(t('errors.imageLoadError'));
      };
      img.src = uploadedImageRef.current;
    }
  }, [threshold]);

  // 드롭존 관련 이벤트 핸들러 추가
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      
      // 이미지 타입 확인
      if (!file.type.startsWith("image/")) {
        setError(t('errors.imageTypeOnly'));
        return;
      }
      
      processImageWithObjectDetection(file);
    }
  };

  // 파일 선택 핸들러
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setError(t('errors.selectFile'));
      return;
    }
    
    setError(null);
    console.log("파일 선택됨:", file.name, file.type, file.size + "bytes");
    
    // 이미지 타입 확인
    if (!file.type.startsWith("image/")) {
      setError(t('errors.imageTypeOnly'));
      return;
    }
    
    processImageWithObjectDetection(file);
  };
  
  // 직접 파일 업로드 처리 (input 우회) 함수 제거
  const handleDirectUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        console.log("직접 업로드 방식으로 파일 선택됨");
        processImageWithObjectDetection(file);
      }
    };
    
    input.click();
  };

  // 4x3 그리드로 이미지 분할
  const splitImageIntoGrid = (img: HTMLImageElement) => {
    console.log("이미지 분할 시작");
    
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) {
        setError(t('errors.canvasNotSupported'));
        console.error("Canvas 2D 컨텍스트를 가져올 수 없습니다");
        return;
      }

      // 각 그리드 셀의 크기 계산
      const cellWidth = img.width / 4;
      const cellHeight = img.height / 3;
      const newGridImages: string[] = [];

      console.log("그리드 셀 크기:", cellWidth, "x", cellHeight);

      // 4x3 그리드로 분할
      for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 4; x++) {
          canvas.width = cellWidth;
          canvas.height = cellHeight;
          
          try {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(
              img,
              x * cellWidth,
              y * cellHeight,
              cellWidth,
              cellHeight,
              0,
              0,
              cellWidth,
              cellHeight
            );
            
            const dataUrl = canvas.toDataURL("image/png");
            newGridImages.push(dataUrl);
            console.log(`그리드 셀 (${x}, ${y}) 처리 완료`);
          } catch (error) {
            console.error(`이미지 분할 오류 (${x}, ${y}):`, error);
          }
        }
      }

      console.log("이미지 분할 완료, 총 프레임:", newGridImages.length);
      
      if (newGridImages.length > 0) {
        setGridImages(newGridImages);
      } else {
        setError(t('errors.noFramesGenerated'));
      }
    } catch (err) {
      console.error("이미지 분할 중 예외 발생:", err);
      setError(t('errors.splittingError'));
    }
  };

  // 재생/일시정지 토글
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // GIF 생성
  const createGif = async () => {
    if (!gridImages.length) return;
    setIsLoading(true);
    setError(null);

    try {
      // 각 프레임을 별도의 캔버스에 준비
      const framePromises = gridImages.map((src) => {
        return new Promise<HTMLCanvasElement>((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 300;
            canvas.height = 300;
            const ctx = canvas.getContext('2d');
            
            if (!ctx) {
              reject(new Error('Canvas context를 가져올 수 없습니다.'));
              return;
            }
            
            // 투명 배경으로 시작
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // 이미지 중앙에 배치
            const padding = 10;
            const size = Math.min(canvas.width, canvas.height) - padding * 2;
            const x = (canvas.width - size) / 2;
            const y = (canvas.height - size) / 2;
            
            ctx.drawImage(img, x, y, size, size);
            resolve(canvas);
          };
          img.onerror = () => reject(new Error('이미지 로딩 실패'));
          img.src = src;
        });
      });

      // 모든 프레임이 준비될 때까지 기다림
      const frames = await Promise.all(framePromises);

      // Gif.js 옵션 설정
      const gif = new GIF({
        workers: 2,
        quality: 10,
        width: 300,
        height: 300,
        workerScript: '/gif.worker.js',
        background: 'transparent',
        transparent: 'rgba(0,0,0,0)',
        repeat: 0,
        debug: false,
        dispose: 2,        // 각 프레임마다 화면을 지우도록 설정
        dither: false,
        delay: frameDelay  // 프레임 간 지연 시간 사용
      });

      // 준비된 프레임들을 GIF에 추가
      frames.forEach(canvas => {
        gif.addFrame(canvas, { delay: frameDelay, dispose: 2 });
      });

      gif.on('finished', (blob: Blob) => {
        const url = URL.createObjectURL(blob);
        setGifUrl(url);
        setIsLoading(false);
      });

      gif.on('progress', (progress: number) => {
        console.log(`GIF 생성 진행률: ${Math.round(progress * 100)}%`);
      });

      gif.render();
    } catch (err) {
      console.error('GIF 생성 중 오류 발생:', err);
      setError('GIF 생성 중 오류가 발생했습니다.');
      setIsLoading(false);
    }
  };

  // 애니메이션 프레임 업데이트
  useEffect(() => {
    if (!isPlaying || gridImages.length === 0) return;
    
    console.log("애니메이션 재생 시작");
    const interval = setInterval(() => {
      setCurrentFrame((prev) => {
        const next = (prev + 1) % gridImages.length;
        console.log(`프레임 전환: ${prev} -> ${next}`);
        return next;
      });
    }, frameDelay);
    
    return () => {
      console.log("애니메이션 정지");
      clearInterval(interval);
    };
  }, [isPlaying, gridImages.length, frameDelay]);

  // GIF 다운로드
  const downloadGif = () => {
    if (!gifUrl) {
      setError(t('errors.noGIFtoDownload'));
      return;
    }
    
    try {
      const link = document.createElement("a");
      link.href = gifUrl;
      link.download = "animation.gif";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      console.log("GIF 다운로드 완료");
    } catch (err) {
      console.error("GIF 다운로드 중 오류:", err);
      setError(t('errors.GIFdownloadError'));
    }
  };

  // 위치 조정 후 프레임 다시 그리기
  const redrawWithAdjustments = () => {
    if (!uploadedImage) {
      setError(t('errors.noImageToAdjust'));
      return;
    }

    const img = new Image();
    img.onload = () => {
      splitImageIntoGrid(img);
    };
    img.onerror = () => {
      setError(t('errors.imageLoadError'));
    };
    img.src = uploadedImage;
  };

  // 배경 제거 함수
  const removeBackgroundFromImage = (img: HTMLImageElement): HTMLCanvasElement => {
    console.log("배경 제거 시작");
    
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) {
      throw new Error("캔버스 컨텍스트를 가져올 수 없습니다");
    }
    
    // 원본 이미지 그리기
    ctx.drawImage(img, 0, 0);
    
    // 이미지 데이터 가져오기
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // 왼쪽 상단 모서리 픽셀의 색상을 배경색으로 가정
    const r0 = data[0];
    const g0 = data[1];
    const b0 = data[2];
    
    // 배경색과 유사한 픽셀을 투명하게 설정
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // 색상 차이 계산
      const diff = Math.sqrt(
        Math.pow(r - r0, 2) + 
        Math.pow(g - g0, 2) + 
        Math.pow(b - b0, 2)
      );
      
      // 색상 차이가 임계값보다 작으면 투명하게 처리
      if (diff < threshold) {
        data[i + 3] = 0; // 알파 채널을 0으로 설정 (완전 투명)
      }
    }
    
    // 수정된 이미지 데이터를 다시 캔버스에 그리기
    ctx.putImageData(imageData, 0, 0);
    console.log("배경 제거 완료");
    
    return canvas;
  };
  
  // 연결된 객체 감지 함수 (캐릭터 위치 찾기)
  const detectObjectBoundingBoxes = (canvas: HTMLCanvasElement): BoundingBox[] => {
    console.log("객체 감지 시작");
    
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) {
      throw new Error("캔버스 컨텍스트를 가져올 수 없습니다");
    }
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;
    
    // 방문 여부를 추적하는 2D 배열
    const visited = Array(height).fill(0).map(() => Array(width).fill(false));
    
    // 감지된 객체들의 경계 상자
    const objects: BoundingBox[] = [];
    
    // 너비 우선 탐색(BFS)으로 연결된 영역 찾기
    const bfs = (startX: number, startY: number) => {
      // 시작 픽셀이 투명하면 무시
      const startIdx = (startY * width + startX) * 4;
      if (data[startIdx + 3] === 0) return null;
      
      let minX = startX, maxX = startX, minY = startY, maxY = startY;
      const queue: [number, number][] = [[startX, startY]];
      visited[startY][startX] = true;
      
      // 인접한 픽셀을 찾기 위한 방향 (상, 하, 좌, 우, 대각선)
      const dx = [-1, 0, 1, -1, 1, -1, 0, 1];
      const dy = [-1, -1, -1, 0, 0, 1, 1, 1];
      
      let pixelCount = 0;
      
      while (queue.length > 0) {
        const [x, y] = queue.shift()!;
        pixelCount++;
        
        // 경계 상자 업데이트
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
        
        // 인접한 픽셀 확인
        for (let i = 0; i < 8; i++) {
          const nx = x + dx[i];
          const ny = y + dy[i];
          
          // 범위 체크
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
          
          // 이미 방문했거나 투명한 픽셀은 무시
          if (visited[ny][nx]) continue;
          
          const idx = (ny * width + nx) * 4;
          if (data[idx + 3] === 0) continue;
          
          // 큐에 추가하고 방문 표시
          queue.push([nx, ny]);
          visited[ny][nx] = true;
        }
      }
      
      // 너무 작은 객체는 노이즈로 간주하고 무시 (최소 10픽셀)
      if (pixelCount < 10) return null;
      
      // 경계 상자 반환
      return {
        x: minX,
        y: minY,
        width: maxX - minX + 1,
        height: maxY - minY + 1
      };
    };
    
    // 모든 픽셀을 스캔하며 연결된 객체 찾기
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (!visited[y][x]) {
          const boundingBox = bfs(x, y);
          if (boundingBox) {
            objects.push(boundingBox);
          }
        }
      }
    }
    
    console.log(`객체 감지 완료: ${objects.length}개 객체 발견`);
    return objects;
  };

  // 이미지 처리 및 객체 감지 통합 함수
  const processImageWithObjectDetection = async (file: File | null, loadedImg?: HTMLImageElement) => {
    try {
      console.log("객체 감지 방식으로 이미지 처리 시작");
      
      // 이미지 로드
      let img: HTMLImageElement;
      if (file) {
        // 파일을 데이터 URL로 변환
        const dataUrl = await readFileAsDataURL(file);
        setUploadedImage(dataUrl);
        uploadedImageRef.current = dataUrl;
        
        img = await loadImage(dataUrl);
      } else if (loadedImg) {
        img = loadedImg;
      } else {
        throw new Error("파일 또는 이미지가 필요합니다");
      }
      
      console.log("이미지 로드 완료:", img.width, "x", img.height);
      
      // 배경 제거
      const transparentCanvas = removeBackgroundFromImage(img);
      
      // 객체 감지
      const objects = detectObjectBoundingBoxes(transparentCanvas);
      
      if (objects.length < 1) {
        setError(t('errors.noObjectsFound'));
        return;
      }
      
      // 무조건 12개의 객체로 맞추기
      let adjustedObjects = [...objects];
      
      if (objects.length < 12) {
        // 객체가 부족한 경우, 기존 객체를 반복해서 12개 채우기
        console.log(`객체 수가 부족합니다: ${objects.length}개. 12개로 채웁니다.`);
        while (adjustedObjects.length < 12) {
          const repeatIndex = adjustedObjects.length % objects.length;
          adjustedObjects.push({...objects[repeatIndex]});
        }
      }
      
      // 크기 순으로 정렬하여 가장 큰 12개 선택
      if (objects.length > 12) {
        console.log(`객체가 너무 많습니다: ${objects.length}개. 크기가 큰 12개를 선택합니다.`);
        adjustedObjects = objects
          .sort((a, b) => (b.width * b.height) - (a.width * a.height))
          .slice(0, 12);
      }
      
      // 객체 추출 및 정렬
      const extractedObjects = extractAndSortObjects(transparentCanvas, adjustedObjects);
      setGridImages(extractedObjects);
      
      console.log("이미지 처리 완료, 객체 수:", extractedObjects.length);
      
      // 약간의 지연 후 애니메이션 미리보기 영역으로 스크롤
      setTimeout(() => {
        // ref가 있으면 ref로 스크롤
        if (animationPreviewRef.current) {
          animationPreviewRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        } else {
          // 없으면 기본 스크롤
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
          });
        }
        
        // 애니메이션 자동 재생 시작
        setIsPlaying(true);
      }, 500);
      
    } catch (err) {
      console.error("이미지 처리 중 오류:", err);
      setError(`${t('errors.imageProcessError')}: ${err instanceof Error ? err.message : '알 수 없는 오류'}`);
    }
  };
  
  // 파일을 Data URL로 읽기
  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result && typeof e.target.result === 'string') {
          resolve(e.target.result);
        } else {
          reject(new Error("파일을 Data URL로 변환할 수 없습니다"));
        }
      };
      reader.onerror = () => reject(new Error("파일 읽기 오류"));
      reader.readAsDataURL(file);
    });
  };
  
  // 이미지 로드
  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("이미지 로드 오류"));
      img.src = src;
    });
  };
  
  // 객체 추출 및 정렬
  const extractAndSortObjects = (canvas: HTMLCanvasElement, objects: BoundingBox[]): string[] => {
    console.log("객체 추출 및 정렬 시작");
    
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("캔버스 컨텍스트를 가져올 수 없습니다");
    }
    
    // 너비와 높이에 따라 객체 정렬
    // 먼저 y값(행)으로 정렬하고, 같은 행 내에서는 x값(열)으로 정렬
    const sortedObjects = [...objects].sort((a, b) => {
      // y 좌표 기준으로 행 구분 (약간의 여유를 두고)
      const rowDiff = Math.floor(a.y / 30) - Math.floor(b.y / 30);
      if (rowDiff !== 0) return rowDiff;
      
      // 같은 행이면 x 좌표로 정렬
      return a.x - b.x;
    });
    
    // 필요하다면 원하는 객체 수에 맞게 조정
    const targetCount = 12; // 원하는 객체 수
    let adjustedObjects = sortedObjects;
    
    if (sortedObjects.length > targetCount) {
      // 너무 많은 경우, 크기가 가장 큰 객체 우선 선택
      adjustedObjects = sortedObjects
        .sort((a, b) => (b.width * b.height) - (a.width * a.height))
        .slice(0, targetCount);
      
      // 다시 위치 기준으로 정렬
      adjustedObjects.sort((a, b) => {
        const rowDiff = Math.floor(a.y / 30) - Math.floor(b.y / 30);
        if (rowDiff !== 0) return rowDiff;
        return a.x - b.x;
      });
    }
    
    // 객체 크기 표준화 - 모든 객체가 동일한 정사각형 크기를 가지도록 설정
    
    // 객체 크기 중 최대값을 계산 (모든 객체를 포함할 수 있는 크기)
    let maxDimension = 0;
    
    adjustedObjects.forEach(obj => {
      maxDimension = Math.max(maxDimension, obj.width, obj.height);
    });
    
    // 안전 여백 추가 (객체가 잘리지 않도록)
    const standardSize = Math.ceil(maxDimension * 1.2);
    console.log(`표준 크기 설정: ${standardSize}x${standardSize}px (정사각형)`);
    
    // 표준 크기의 정사각형 캔버스 생성
    const standardCanvas = document.createElement("canvas");
    standardCanvas.width = standardSize;
    standardCanvas.height = standardSize;
    
    // 객체 추출 및 크기 조정
    return adjustedObjects.map((obj, index) => {
      // 표준 캔버스 초기화 (완전 투명 배경)
      const standardCtx = standardCanvas.getContext("2d");
      if (!standardCtx) {
        throw new Error("표준 캔버스 컨텍스트를 가져올 수 없습니다");
      }
      standardCtx.clearRect(0, 0, standardCanvas.width, standardCanvas.height);
      
      // 임시 캔버스에 원본 객체 추출
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = obj.width;
      tempCanvas.height = obj.height;
      const tempCtx = tempCanvas.getContext("2d");
      
      if (!tempCtx) {
        throw new Error("임시 캔버스 컨텍스트를 가져올 수 없습니다");
      }
      
      // 원본 캔버스에서 객체 부분만 추출
      tempCtx.drawImage(
        canvas,
        obj.x, obj.y, obj.width, obj.height,
        0, 0, obj.width, obj.height
      );
      
      // 비율을 유지하면서 최대한 크게 그리되 표준 크기를 넘지 않도록 조정
      const scale = Math.min(
        standardSize * 0.9 / obj.width,  // 가로 비율 (10% 여백)
        standardSize * 0.9 / obj.height  // 세로 비율 (10% 여백)
      );
      
      // 크기 조정된 객체의 치수
      const scaledWidth = Math.floor(obj.width * scale);
      const scaledHeight = Math.floor(obj.height * scale);
      
      // 중앙 정렬을 위한 위치 계산 (정확히 중앙에 오도록)
      const centerX = Math.floor((standardSize - scaledWidth) / 2);
      const centerY = Math.floor((standardSize - scaledHeight) / 2);
      
      // 표준 캔버스에 객체 그리기 (중앙 정렬)
      standardCtx.drawImage(
        tempCanvas,
        0, 0, obj.width, obj.height,
        centerX, centerY, scaledWidth, scaledHeight
      );
      
      console.log(`객체 ${index + 1} 추출 및 크기 조정 완료: ${obj.width}x${obj.height} -> ${scaledWidth}x${scaledHeight}`);
      return standardCanvas.toDataURL("image/png");
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-2 sm:p-4 md:p-6 gap-4 sm:gap-6 md:gap-8">
      <div className="w-full flex justify-center items-center mb-2">
        <h1 className="text-xl sm:text-2xl md:text-3xl mt-16 font-bold text-center">{t('title')}</h1>
      </div>
      
      <p className="text-center text-gray-400 max-w-[15rem] sm:max-w-sm md:max-w-lg mb-2 text-sm sm:text-base">
        {t('description')}
      </p>
      
      {/* 예시 이미지 및 GIF */}
      <div className="w-full max-w-3xl flex flex-col items-center justify-center gap-2 sm:gap-4 mb-3 sm:mb-4 p-2 sm:p-3 md:p-4 bg-gray-50 rounded-lg border border-gray-100 shadow-sm">
        <div className="relative w-full text-center mb-0 sm:mb-1">
          <span className="inline-block px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full shadow-sm">
            {t('example')}
          </span>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 sm:gap-4 w-full">
          <div className="flex flex-col items-center">
            <p className="text-xs font-medium text-gray-700 mb-1">{t('originalExample')}</p>
            <img 
              src="/images/example.png" 
              alt={t('originalExample')}
              className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 object-contain border rounded-md"
            />
          </div>
          <div className="flex items-center justify-center my-1">
            {/* 모바일에서는 아래 화살표, 데스크톱에서는 오른쪽 화살표 */}
            <span className="md:hidden text-lg text-gray-400">⬇️</span>
            <span className="hidden md:flex text-xl text-gray-400 items-center h-44">➡️</span>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-xs font-medium text-gray-700 mb-1">{t('generatedExample')}</p>
            <img 
              src="/images/example.gif" 
              alt={t('generatedExample')}
              className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 object-contain border rounded-md bg-black"
            />
          </div>
        </div>
        <div className="mt-2 p-2 bg-gray-100 rounded-md w-full text-xs">
          <details className="text-gray-700 md:open" open>
            <summary className="font-medium cursor-pointer md:hidden">{t('prompt')} & {t('generationTool')}</summary>
            <div className="hidden md:block mb-1.5">
              <span className="font-medium">{t('prompt')} & {t('generationTool')}</span>
            </div>
            <p className="mt-1 text-xs text-gray-700 italic">
              <span className="font-semibold">{t('prompt')}:</span> This 2D sprite sheet features a blocky character in 12 frames, arranged in a 4x3 grid and showcasing various boxing and kicking moves. The character, resembling a Roblox avatar, is hand-drawn with visible pencil lines, sporting a tan square head, rectangular black eyes, a navy-blue suit, and red-orange tie, and its actions are clearly depicted in four distinct rows: punch, and kick sequence, all with deep focus and clean details on a white background.
            </p>
            <p className="mt-1 text-xs text-gray-700">
              <span className="font-semibold">{t('generationTool')}:</span> <a href="https://chatgpt.com/" className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">ChatGPT</a>에서 GPT-4o로 생성함
            </p>
          </details>
          <p className="text-xs text-gray-700 mt-2">
            <span className="font-semibold">{t('process')}:</span> {t('processDescription')}
          </p>
        </div>
      </div>
      
      {/* 에러 메시지 */}
      {error && (
        <div className="w-full max-w-md p-2 sm:p-3 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      
      {/* 파일 업로드 영역 */}
      <div className="flex flex-col items-center gap-3 sm:gap-4 w-full max-w-md px-2 sm:px-0">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          ref={fileInputRef}
        />
        
        {/* 드래그 앤 드롭 영역 */}
        <div 
          className={`w-full border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors
            ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}`}
          onClick={() => fileInputRef.current?.click()}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            <span className="font-medium text-sm text-gray-600">Drag & Drop</span>
            <button
              type="button"
              className="mt-2 px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-xs sm:text-sm"
            >
              {t('fileSelect')}
            </button>
          </div>
        </div>
        
        <p className="text-xs sm:text-sm text-gray-500 mb-16">
          {t('uploadHint')}
        </p>
      </div>

      {/* 이미지 미리보기 */}
      {uploadedImage && (
        <div className="w-full max-w-md px-2 sm:px-0">
          <p className="font-medium mb-2 text-sm sm:text-base">{t('originalImage')}:</p>
          <img 
            src={uploadedImage} 
            alt={t('originalImage')} 
            className="w-full border rounded-md" 
          />
          
          {/* 임계값 조정 */}
          <div className="options-container mt-4 mb-4">
            <div className="bg-slate-100 rounded-t p-2 border border-slate-200">
              <h3 className="text-sm md:text-md font-medium text-slate-800">{t('settings')}</h3>
            </div>
            
            <div className="options-body p-2 sm:p-3 border border-slate-200 rounded-b">
              <div className="mb-3">
                <label className="block text-xs sm:text-sm font-medium mb-1">
                  {t('backgroundThreshold')}: {threshold}
                </label>
                <input 
                  type="range" 
                  min="1" 
                  max="50" 
                  value={threshold} 
                  onChange={(e) => setThreshold(Number(e.target.value))} 
                  className="w-full"
                />
              </div>
              
              <div className="mb-0">
                <label className="block text-xs sm:text-sm font-medium mb-1">
                  {t('frameRate')}: {Math.round(1000 / frameDelay)}{t('fps')} ({frameDelay}ms)
                </label>
                <input 
                  type="range" 
                  min="50" 
                  max="1000" 
                  step="50"
                  value={frameDelay} 
                  onChange={(e) => setFrameDelay(Number(e.target.value))} 
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 애니메이션 재생 영역 */}
      {gridImages.length > 0 && (
        <div ref={animationPreviewRef} className="flex flex-col items-center gap-3 sm:gap-4 w-full max-w-md px-2 sm:px-0">
          <p className="font-medium text-sm sm:text-base">{t('animationPreview')} ({t('frame')} {currentFrame + 1}/{gridImages.length}):</p>
          <div className="w-full max-w-md aspect-square relative border rounded-md overflow-hidden bg-gray-100">
            <img
              src={gridImages[currentFrame]}
              alt={`${t('frame')} ${currentFrame + 1}`}
              className="w-full h-full object-contain"
            />
          </div>
          
          <div className="flex items-center gap-3 sm:gap-4 w-full justify-center">
            <button
              onClick={togglePlayPause}
              className="px-3 sm:px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 text-sm sm:text-base flex-1 max-w-[180px]"
            >
              {isPlaying ? t('pause') : t('play')}
            </button>
            
            <button
              onClick={createGif}
              disabled={isLoading}
              className="px-3 sm:px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 disabled:bg-gray-400 text-sm sm:text-base flex-1 max-w-[180px]"
            >
              {isLoading ? t('generatingGIF') : t('generateGIF')}
            </button>
          </div>
        </div>
      )}

      {/* GIF 미리보기 및 다운로드 */}
      {gifUrl && (
        <div className="flex flex-col items-center gap-3 sm:gap-4 w-full max-w-md px-2 sm:px-0">
          <p className="font-medium text-sm sm:text-base">{t('generatedGIF')}:</p>
          <img src={gifUrl} alt={t('generatedGIF')} className="w-full max-w-md border rounded-md" />
          <button
            onClick={downloadGif}
            className="px-3 sm:px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 text-sm sm:text-base"
          >
            {t('downloadGIF')}
          </button>
        </div>
      )}
    </div>
  );
}

// 메인 페이지 컴포넌트
export default function Home() {
  const params = useParams();
  const locale = params?.locale as string || 'ko';
  
  // 클라이언트에서 메시지 로드
  const [messages, setMessages] = useState<any>(null);
  
  useEffect(() => {
    async function loadMessages() {
      try {
        // 경로 수정
        const msgs = await import(`../../messages/${locale}.json`);
        setMessages(msgs.default);
      } catch (e) {
        console.error("메시지 로드 실패:", e);
        // 영어 메시지로 폴백
        try {
          const enMsgs = await import(`../../messages/en.json`);
          setMessages(enMsgs.default);
          console.log("영어 메시지로 대체됨");
        } catch (fallbackError) {
          console.error("영어 메시지도 로드 실패:", fallbackError);
          // 기본 메시지 객체 생성 (최소한의 UI 표시를 위한)
          setMessages({
            app: {
              title: "Cut and Move",
              description: "Creates GIFs from character frames in transparent background images."
            }
          });
        }
      }
    }
    
    loadMessages();
  }, [locale]);
  
  if (!messages) {
    return <div>로딩 중...</div>;
  }
  
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <HomeContent />
    </NextIntlClientProvider>
  );
}
  