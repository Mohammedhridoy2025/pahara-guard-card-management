"use client";

import React from 'react';
import Image from "next/image";
import { QRCodeCanvas } from "./qr-code-canvas";
import { Phone, ShieldCheck, User } from "lucide-react";

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
      <div className="relative w-full h-full text-blue-900 rounded-xl shadow-lg overflow-hidden bg-gradient-to-br from-gray-50 to-white flex flex-col border border-gray-300">
        
        {/* Header */}
        <header className="flex justify-between items-center bg-blue-800 text-white p-2">
          <div className="text-left">
            <h2 className="font-bold text-sm leading-tight">সিকিউরিটি সার্ভিস</h2>
            <p className="text-xs font-medium opacity-80">পাহাড়াদারদের আইডি কার্ড</p>
          </div>
          <ShieldCheck className="w-8 h-8 opacity-90" />
        </header>

        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center">
            <ShieldCheck className="w-48 h-48 text-gray-200/40" />
        </div>

        {/* Card Body */}
        <div className="relative flex p-3 gap-3 flex-1 z-10">
          {/* Left Column: Photo and Emergency Contacts */}
          <div className="flex flex-col justify-start w-[100px] flex-shrink-0">
             <div className="w-[95px] h-[120px] bg-gray-100 rounded-lg flex items-center justify-center border-2 border-white shadow-md">
                 {photoDataUri ? (
                    <Image
                      src={photoDataUri}
                      alt="Guard photo"
                      width={95}
                      height={120}
                      className="object-cover w-full h-full rounded-md"
                    />
                  ) : (
                     <div className="w-full h-full bg-gray-200 rounded-md flex flex-col items-center justify-center text-gray-500">
                      <User className="w-8 h-8 mb-1" />
                      <span className="text-[10px] font-semibold">ছবি</span>
                    </div>
                  )}
             </div>
             {emergencyContacts && (
                  <div className="mt-2">
                     <div className="flex items-center gap-1 text-sm font-semibold text-gray-700 mb-0.5 whitespace-nowrap">
                        <Phone className="w-4 h-4"/>
                        <span>জরুরি যোগাযোগ</span>
                     </div>
                     <div className="text-xs whitespace-pre-line leading-tight font-medium text-gray-800">
                        {emergencyContacts}
                     </div>
                  </div>
                )}
          </div>
          
          {/* Right Column: Info and QR Code */}
          <div className="flex-1 min-w-0 h-full flex flex-col">
            <div className="font-extrabold text-[22px] leading-tight text-blue-950 truncate" title={name}>
              {name || "নাম পাওয়া যায়নি"}
            </div>
            <div className="text-sm font-bold text-white bg-blue-800 px-3 py-1 rounded-full mt-2 inline-block self-start">
              আইডি: {idNumber || "N/A"}
            </div>
            <div className="text-xs leading-snug mt-2 font-medium text-gray-600" title={address}>
              ঠিকানা: {address || "ঠিকানা পাওয়া যায়নি"}
            </div>

            <div className="mt-auto flex justify-end">
                <div className="flex-shrink-0">
                    <QRCodeCanvas data={qrCodeData || ""} className="w-[75px] h-[75px]" />
                </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="bg-blue-800 text-white text-center text-[10px] font-semibold p-1.5">
            আর্থিক সহযোগিতায় কালিপুর গ্রামের প্রবাসী
        </footer>
      </div>
    </div>
  );
});

GuardCardPreview.displayName = 'GuardCardPreview';
