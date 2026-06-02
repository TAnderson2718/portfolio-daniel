import './globals.css';
import content from '@/content.json';
import SvgFilters from '@/components/SvgFilters';

export const metadata = {
  title: content.meta.siteTitle,
  description: content.meta.description,
  openGraph: {
    title: content.meta.siteTitle,
    description: content.meta.description,
    type: 'website',
    images: content.meta.ogImage ? [content.meta.ogImage] : [],
  },
  twitter: {
    card: 'summary_large_image',
    title: content.meta.siteTitle,
    description: content.meta.description,
    images: content.meta.ogImage ? [content.meta.ogImage] : [],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&family=Barlow+Condensed:wght@400;500;600;700;800&family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <SvgFilters />
        {children}
      </body>
    </html>
  );
}
