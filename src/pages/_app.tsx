// src/pages/_app.tsx
import '../app/globals.css' 
import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from "@/context/authContext"


export default function MyApp({ Component, pageProps }: AppProps) {
  return (
      <>
      <AuthProvider>
        <Component {...pageProps} />
        <Toaster />
      </AuthProvider>
      </>

  )
}
