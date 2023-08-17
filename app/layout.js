'use client'
import './globals.css'
import { AuthContextProvider } from '@/context/AuthContext'

export const metadata = {
  title: 'Hablame',
  description: 'Text to voice the articles you would love to read',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.js. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
        <AuthContextProvider>
          {children}
        </AuthContextProvider>
      </body>
    </html>
  )
}
