import BottomNav from '@/components/BottomNav';
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from 'next/script';
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "분실물 찾기",
  description: "분실물 찾기 웹 애플리케이션",
  keywords: ["분실물", "lost and found", "분실물 찾기", "분실물 등록"],
  authors: [{ name: "Unit6" }],
  creator: "Unit6",
  publisher: "Unit6",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "분실물 찾기",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        {/* Hidden Google Translate Widget */}
        <div id="google_translate_element" style={{ display: 'none' }}></div>
        <Script
          id="google-translate-init"
          strategy="afterInteractive"
        >
          {`
            function googleTranslateElementInit() {
              new google.translate.TranslateElement({pageLanguage: 'ko'}, 'google_translate_element');
            }
          `}
        </Script>
        <Script
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />
        
        <LanguageProvider>
          <div className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen pb-16 bg-gray-100`}>
            <main className="flex-grow px-4 py-6">
              <div className="bg-white rounded-2xl shadow-md w-[380px] mx-auto p-4">
                {children}
              </div>
            </main>
            <BottomNav />
          </div>
        </LanguageProvider>
      </body>
    </html>
    
  );
}
