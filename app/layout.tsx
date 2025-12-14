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
        className="min-h-screen min-w-screen bg-[linear-gradient(89.94deg,#111953_0.09%,#4157FE_100.9%)]"
      >
        {children}
      </body>
    </html>
  );
}
