import type {Metadata} from 'next';
import { Hind_Siliguri } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

const hindSiliguri = Hind_Siliguri({
  subsets: ['bengali'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-hind-siliguri',
});


export const metadata: Metadata = {
  title: 'GuardCard',
  description: 'সিকিউরিটি গার্ড কার্ড জেনারেটর',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <body className={`${hindSiliguri.className} font-body antialiased body-bg-gradient min-h-screen`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
