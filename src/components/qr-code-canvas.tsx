"use client";

import { useEffect, useRef } from "react";
import QRCode from "qrcode";
import { Skeleton } from "@/components/ui/skeleton";

interface QRCodeCanvasProps {
  data: string;
  className?: string;
}

export function QRCodeCanvas({ data, className }: QRCodeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && data) {
      QRCode.toCanvas(
        canvasRef.current,
        data,
        {
          width: 70,
          margin: 1,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
        },
        (error) => {
          if (error) console.error(error);
        }
      );
    }
  }, [data]);

  return (
    <div
      className={`flex items-center justify-center bg-white rounded-md p-[3px] ${className}`}
    >
      {!data ? (
        <Skeleton className="w-[64px] h-[64px]" />
      ) : (
        <canvas ref={canvasRef} style={{ width: "64px", height: "64px" }} />
      )}
    </div>
  );
}
