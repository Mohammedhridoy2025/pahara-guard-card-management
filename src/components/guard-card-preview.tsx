"use client";

import React from 'react';
import Image from "next/image";
import { QRCodeCanvas } from "./qr-code-canvas";
import { Phone, ShieldCheck } from "lucide-react";

interface GuardCardPreviewProps {
  name: string;
  address: string;
  idNumber: string;
  emergencyContacts?: string;
  photoDataUri?: string | null;
  qrCodeData: string | null;
}

export const GuardCardPreview = React.forwardRef<HTMLDivElement, GuardCardPreviewProps>(({
  name,
  address,
  idNumber,
  emergencyContacts,
  photoDataUri,
  qrCodeData,
}, ref) => {
  return (
    <div ref={ref} className="w-full aspect-[85.6/54] transition-all duration-300 card-print bg-transparent font-headline">
      <div className="relative w-full h-full p-3 text-blue-900 rounded-xl shadow-lg overflow-hidden bg-white flex flex-col border border-gray-200">
        
        {/* Header */}
        <header className="flex justify-between items-start">
          <div className="text-left">
            <h2 className="font-bold text-sm leading-tight text-blue-900/80">সিকিউরিটি সার্ভিস</h2>
            <p className="text-xs text-blue-900/60 font-medium">কালিপুর গ্রামঃ পাহাড়াদারদের আইডি কার্ড</p>
          </div>
          <ShieldCheck className="w-8 h-8 text-blue-500" />
        </header>

        {/* Card Body */}
        <div className="flex items-center my-3 gap-3 flex-1">
          <div className="flex-shrink-0 w-[95px] h-full relative">
             <div className="absolute w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                 {photoDataUri ? (
                    <Image
                      src={photoDataUri}
                      alt="Guard photo"
                      width={95}
                      height={120}
                      className="object-cover w-full h-full rounded-lg border-2 border-white"
                    />
                  ) : (
                     <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
                      <span className="text-[10px]">ছবি</span>
                    </div>
                  )}
             </div>
          </div>
          
          <div className="flex-1 min-w-0 h-full flex flex-col justify-center">
            <div className="font-extrabold text-2xl leading-tight text-blue-950 truncate" title={name}>
              {name || "মোঃ আল-আমিন"}
            </div>
            <div className="text-sm leading-snug mt-1 font-medium text-gray-600" title={address}>
              {address || "কালিপুর, হোমনা, কুমিল্লা"}
            </div>
            <div className="text-base font-bold text-white bg-blue-800 px-3 py-1 rounded-full mt-2.5 inline-block self-start">
              আইডি: {idNumber || "০১"}
            </div>
          </div>

          <div className="flex-shrink-0 self-end">
            <QRCodeCanvas data={qrCodeData || ""} className="w-[80px] h-[80px]" />
          </div>
        </div>
        
        {/* Emergency Contacts */}
        {emergencyContacts && (
          <div className="mt-auto border-t border-gray-200 pt-2">
             <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-0.5">
                <Phone className="w-3 h-3"/>
                <span>জরুরি প্রয়োজনে যোগাযোগ</span>
             </div>
             <div className="text-xs whitespace-pre-line leading-tight font-medium text-gray-800">
                {emergencyContacts}
             </div>
          </div>
        )}
      </div>
    </div>
  );
});

GuardCardPreview.displayName = 'GuardCardPreview';
