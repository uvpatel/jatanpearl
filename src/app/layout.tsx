import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pearl & Jatan - Destination Wedding Invitation",
  description:
    "Destination Wedding invitation for Pearl & Jatan in Anand, Gujarat & Mandavgarh (Mandu), Madhya Pradesh. 15 January – 2 February 2027.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}


