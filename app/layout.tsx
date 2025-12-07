import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "KAZENTIC",
  description: "Workspace and Project Management Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="min-h-screen min-w-screen bg-background"
      >
        {children}
      </body>
    </html>
  );
}
