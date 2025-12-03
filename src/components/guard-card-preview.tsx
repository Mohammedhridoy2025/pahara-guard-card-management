"use client";

import React from 'react';
import Image from "next/image";
import { QRCodeCanvas } from "./qr-code-canvas";
import { Phone } from "lucide-react";

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
    <div ref={ref} className="w-full aspect-[85.6/54] transition-all duration-300 card-print bg-white">
      <div className="relative w-full h-full p-2.5 text-white rounded-xl shadow-2xl overflow-hidden bg-guard-card-end flex flex-col justify-between">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 right-0 h-[5px] bg-gradient-to-r from-gold-start via-gold-mid to-gold-end"></div>
        <div className="absolute bottom-16 left-0 right-0 h-4 security-strip z-0"></div>

        {/* Card Header */}
        <header className="relative z-10 flex justify-between items-center">
          <div className="font-bold text-base">সিকিউরিটি সার্ভিস</div>
          <div className="text-xs text-center">
            কালিপুর গ্রামঃ পাহাড়াদারদের আইডি কার্ড
          </div>
        </header>

        {/* Card Body */}
        <div className="relative z-10 flex items-center my-2 gap-3">
          <div className="flex-shrink-0 w-[90px] h-[105px] bg-teal-500 p-1 rounded-md overflow-hidden flex items-center justify-center border-2 border-white/80">
            {photoDataUri ? (
              <Image
                src={photoDataUri}
                alt="Guard photo"
                width={90}
                height={105}
                className="object-cover w-full h-full rounded-sm"
              />
            ) : (
               <div className="w-[80px] h-[95px] bg-white/20 rounded-md flex items-center justify-center text-white/80">
                <span className="text-[10px]">ছবি</span>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="font-bold text-2xl truncate" title={name}>
              {name || "মোঃ আল-আমিন"}
            </div>
            <div className="text-sm leading-tight mt-1" title={address}>
              {address || "কালিপুর, হোমনা, কুমিল্লা"}
            </div>
            <div className="text-sm bg-white/20 px-2 py-1 rounded-md mt-2 inline-block">
              আইডি: {idNumber || "০১"}
            </div>
          </div>

          <div className="flex-shrink-0">
            <QRCodeCanvas data={qrCodeData || ""} className="w-[85px] h-[85px]" />
          </div>
        </div>
        
        {/* Emergency Contacts */}
        {emergencyContacts && (
          <div className="relative z-10 mt-auto">
             <div className="flex items-center gap-2 text-sm font-semibold mb-1">
                <Phone className="w-3 h-3"/>
                <span>জরুরি প্রয়োজনে যোগাযোগ</span>
             </div>
             <div className="text-sm whitespace-pre-line leading-tight pl-1">
                {emergencyContacts}
             </div>
          </div>
        )}

        {/* Card Footer */}
        <footer className="relative z-10 flex justify-between text-center text-xs mt-auto pt-2">
          <div>আর্থিক সহযোগিতায় কালিপুরের প্রবাসী</div>
          <div>সৌজন্যে কাউসার ডিজিটাল স্টুডিও</div>
        </footer>
      </div>
    </div>
  );
});

GuardCardPreview.displayName = 'GuardCardPreview';
