"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { UploadCloud, X } from "lucide-react";

import { Button } from "@/components/ui/button";

interface PhotoUploaderProps {
  onPhotoUpload: (dataUri: string | null) => void;
}

export function PhotoUploader({ onPhotoUpload }: PhotoUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        setPreview(dataUri);
        onPhotoUpload(dataUri);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setPreview(null);
    onPhotoUpload(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      <div
        className="relative group w-full p-4 border-2 border-dashed rounded-lg cursor-pointer text-center flex flex-col justify-center items-center h-48 transition-colors hover:border-primary/80 hover:bg-accent/10"
        onClick={() => fileInputRef.current?.click()}
      >
        {preview ? (
          <>
            <Image
              src={preview}
              alt="Photo preview"
              fill
              className="object-contain rounded-md p-2"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleRemovePhoto}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Remove photo</span>
            </Button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <UploadCloud className="w-10 h-10" />
            <p className="font-semibold">ছবি আপলোড করতে ক্লিক করুন</p>
            <p className="text-xs">
              ছবি প্রিভিউ এখানে দেখানো হবে
            </p>
          </div>
        )}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg"
        className="hidden"
      />
    </div>
  );
}
