import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "菜田账本",
  description: "种菜作物收益与经验统计平台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
