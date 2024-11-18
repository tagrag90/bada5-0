import { Toaster } from "@/components/ui/toaster";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "next-themes";
import localFont from "next/font/local";
import { extractRouterConfig } from "uploadthing/server";
import { fileRouter } from "./api/uploadthing/core";
import "./globals.css";
import ReactQueryProvider from "./ReactQueryProvider";

const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  // title: {
  //   template: "%s | Dive to Bada",
  //   default: "Dive to Bada",
  // },
  // description:
  //   "Bada는 크리에이터와 아티스트들이 소통하고, 협업을 통해 성장할 수 있도록 돕는 소셜 미디어 커뮤니티입니다. 창작자들의 성장을 통해 다양한 콘텐츠룰 만들뿐만 아니라 사람들이 문화에 더욱 쉽게 다가가고 즐길 수 있는 기술과 문화를 만듭니다. ",
  metadataBase: new URL("https://www.divetobada.com"), // 실제 도메인으로 변경
  title: {
    default: "Dive to Bada",
    template: "%s | Dive to Bada",
  },
  description:
    "Bada는 크리에이터와 아티스트들이 소통하고, 협업을 통해 성장할 수 있도록 돕는 소셜 미디어 커뮤니티입니다. 창작자들의 성장을 통해 다양한 콘텐츠룰 만들뿐만 아니라 사람들이 문화에 더욱 쉽게 다가가고 즐길 수 있는 기술과 문화를 만듭니다. ",
  openGraph: {
    title: "Dive to Bada",
    description: "크리에이터와 아티스트들의 소셜 미디어 커뮤니티",
    url: "https://www.divetobada.com",
    siteName: "Dive to Bada",
    images: [
      {
        url: "/og-image.png", // 공유될 때 표시될 이미지
        width: 1200,
        height: 630,
        alt: "Dive to Bada",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dive to Bada",
    description: "크리에이터와 아티스트들의 소셜 미디어 커뮤니티",
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="icon" href="/favicon.ico" />
        {/* 추가적인 메타 태그나 링크를 여기에 추가할 수 있습니다. */}
        {/* <meta charSet="UTF-8" /> */}
      </head>
      <body
        className={`${pretendard.variable} ${geistSans.variable} ${geistMono.variable}`}
      >
        <NextSSRPlugin routerConfig={extractRouterConfig(fileRouter)} />
        <ReactQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </ReactQueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
