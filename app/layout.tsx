import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "板块情报中心",
  description: "AI整理每日热点、政策与行业动态",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}