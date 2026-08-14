"use client";

import { useState } from "react";
import SplashScreen from "@/components/SplashScreen";
import Head from "next/head"; 

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <html lang="es">
      <Head>
        <title>Soto System Digital Solution</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <body className="bg-neutral-950 text-white min-h-screen">
        {isLoading ? (
          <SplashScreen onLoadingComplete={() => setIsLoading(false)} />
        ) : (
          <main>
            {children}
          </main>
        )}
      </body>
    </html>
  );
}