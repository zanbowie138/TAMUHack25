import React from 'react'
import './globals.css'

export default function RootLayout({children}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <head><title></title></head>
            <body>
                {children}
            </body>
        </html>
    )
}