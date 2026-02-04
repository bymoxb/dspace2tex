import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DSpace2BibTeX",
  description:
    'Free online tool to generate BibTeX citations directly from DSpace repositories. Supports DSpace 6 and DSpace 7 (REST API). Perfect for LaTeX and academic writing.',
  keywords: [
    'DSpace BibTeX',
    'DSpace to BibTeX',
    'DSpace citation generator',
    'BibTeX from DSpace',
    'LaTeX DSpace citation',
    'DSpace repository BibTeX',
  ],
  authors: [{ name: 'bymoxb' }],
  creator: 'bymoxb',
  publisher: 'bymoxb',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'DSpace2BibTeX',
    description:
      'Generate BibTeX citations from DSpace repositories (DSpace 6 & 7). Paste a handle or item URL and get a .bib entry instantly.',
    siteName: 'bymoxb',
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
