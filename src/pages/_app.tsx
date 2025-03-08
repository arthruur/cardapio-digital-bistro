// src/pages/_app.tsx
import '../app/globals.css' 
import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Bistrô",
  icons: {
    icon: "/favicon.ico",
  }
};

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
      <>
        <Component {...pageProps} />
        <Toaster />
      </>

  )
}
