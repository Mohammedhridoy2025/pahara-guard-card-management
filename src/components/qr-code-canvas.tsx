"use client";

import { useEffect, useRef } from "react";
import QRCode from "qrcode";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface QRCodeCanvasProps {
  data: string;
  className?: string;
}

export function QRCodeCanvas({ data, className }: QRCodeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (canvasRef.current && containerRef.current && data) {
      const containerWidth = containerRef.current.offsetWidth;
      QRCode.toCanvas(
        canvasRef.current,
        data,
        {
          width: containerWidth,
          margin: 1,
          errorCorrectionLevel: 'H', // Set high error correction for better scannability
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
        },
        (error) => {
          if (error) {
             console.error("QR Code Error: ", error);
          }
        }
      );
    }
  }, [data]);

  return (
    <div
      ref={containerRef}
      className={cn("flex items-center justify-center bg-white rounded-md p-[3px] overflow-hidden", className)}
    >
      {!data ? (
        <Skeleton className="w-full h-full aspect-square" />
      ) : (
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
      )}
    </div>
  );
}
