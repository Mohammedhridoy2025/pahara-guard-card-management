"use client";

import Image from "next/image";
import { QRCodeCanvas } from "./qr-code-canvas";
import { User } from "lucide-react";

interface GuardCardPreviewProps {
  name: string;
  address: string;
  idNumber: string;
  validity: string;
  photoDataUri?: string | null;
  qrCodeData: string | null;
}

export function GuardCardPreview({
  name,
  address,
  idNumber,
  validity,
  photoDataUri,
  qrCodeData,
}: GuardCardPreviewProps) {
  return (
    <div className="w-full max-w-md aspect-[85.6/53.98] transition-all duration-300 card-print">
      <div className="relative w-full h-full p-4 text-white rounded-xl shadow-2xl overflow-hidden bg-gradient-to-br from-guard-card-start to-guard-card-end flex flex-col justify-between">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 right-0 h-[5px] bg-gradient-to-r from-gold-start via-gold-mid to-gold-end"></div>
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-bl-full"></div>
        <div className="absolute bottom-12 left-0 right-0 h-4 security-strip z-0"></div>

        {/* Card Header */}
        <header className="relative z-10 flex justify-between items-center border-b-2 border-white/30 pb-2">
          <div className="font-bold text-base">সিকিউরিটি সার্ভিস</div>
          <div className="text-xs text-center">
            কালিপুর গ্রামঃ পাহাড়াদারদের আইডি কার্ড
          </div>
        </header>

        {/* Card Body */}
        <div className="relative z-10 flex items-center my-2 gap-4">
          <div className="flex-shrink-0 w-[70px] h-[85px] bg-white/20 rounded-md overflow-hidden flex items-center justify-center border-2 border-white/50">
            {photoDataUri ? (
              <Image
                src={photoDataUri}
                alt="Guard photo"
                width={70}
                height={85}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="flex flex-col items-center text-white/80">
                <User className="w-8 h-8" />
                <span className="text-[10px] mt-1">ছবি</span>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="font-bold text-base truncate" title={name}>
              {name || "পুরো নাম"}
            </div>
            <div className="text-xs leading-tight mt-1" title={address}>
              {address || "ঠিকানা"}
            </div>
            <div className="text-xs bg-white/20 px-2 py-1 rounded-md mt-2 inline-block">
              আইডি: {idNumber || "SG-XXXX-XXXX"}
            </div>
          </div>

          <div className="flex-shrink-0">
            <QRCodeCanvas data={qrCodeData || ""} className="w-[70px] h-[70px]" />
          </div>
        </div>

        {/* Card Footer */}
        <footer className="relative z-10 text-center border-t border-white/30 pt-2 text-xs">
          <div>বৈধতা: {validity || "DD/MM/YYYY - DD/MM/YYYY"}</div>
        </footer>

        <div className="absolute bottom-2 right-3 text-[8px] opacity-70 z-10">
          অফিসিয়াল কার্ড
        </div>
      </div>
    </div>
  );
}
