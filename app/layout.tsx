import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Pizzeria Napoli | Beste Pizza in Haßlinghausen & Sprockhövel',
  description: '🍕 Die beste Pizza in Haßlinghausen! Handgemachte Pizzen, frische Pasta, Schnitzel, Salate und Gyros. Lieferung frei Haus ab 10€. Jetzt online bestellen!',
  keywords: 'Pizzeria Haßlinghausen, Pizza Haßlinghausen, Pizzeria Sprockhövel, Pizza Sprockhövel, Pizzeria Napoli, Pizza bestellen, Lieferdienst Haßlinghausen, italienische Küche, Pasta, Schnitzel, Gyros, Salate, Gevelsberg, Pizzeria Napoli Haßlinghausen',
  robots: 'index, follow',
  authors: [{ name: 'Pizzeria Napoli' }],
  creator: 'Pizzeria Napoli',
  publisher: 'Pizzeria Napoli',
  metadataBase: new URL('https://pizzeria-napoli-gevelsberg.vercel.app'),
  alternates: {
    canonical: 'https://pizzeria-napoli-gevelsberg.vercel.app',
  },
  
  // Open Graph (Facebook, WhatsApp, LinkedIn)
  openGraph: {
    title: 'Pizzeria Napoli | Beste Pizza in Haßlinghausen',
    description: '🍕 Handgemachte Pizzen, frische Pasta, Schnitzel & mehr. Lieferung frei Haus ab 10€. Jetzt online bestellen!',
    url: 'https://pizzeria-napoli-gevelsberg.vercel.app',
    siteName: 'Pizzeria Napoli',
    locale: 'de_DE',
    type: 'restaurant',
    images: [
      {
        url: '/images/pizza.png',
        width: 1200,
        height: 630,
        alt: 'Pizzeria Napoli - Beste Pizza in Haßlinghausen',
      },
    ],
  },
  
  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'Pizzeria Napoli | Beste Pizza in Haßlinghausen',
    description: '🍕 Handgemachte Pizzen, frische Pasta, Schnitzel & mehr. Lieferung frei Haus ab 10€!',
    images: ['/images/pizza.png'],
  },
  
  // Zusätzliche SEO-Tags
  verification: {
    google: 'google-site-verification-code', // Hier später deinen Google-Code einfügen
  },
  category: 'restaurant',
  classification: 'Italian Restaurant, Pizzeria, Delivery Service',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: true,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <head>
        {/* Lokale Geschäftsdaten für Google */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Restaurant",
            "name": "Pizzeria Napoli",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Gevelsberger Str. 28",
              "addressLocality": "Sprockhövel",
              "addressRegion": "NRW",
              "postalCode": "45549",
              "addressCountry": "DE"
            },
            "telephone": "+4923399116777",
            "openingHours": "Mo-Su 11:00-22:00",
            "priceRange": "€€",
            "servesCuisine": "Italian, Pizza, Pasta",
            "image": "https://pizzeria-napoli-gevelsberg.vercel.app/images/pizza.png"
          })}
        </script>
      </head>
      <body>{children}</body>
    </html>
  );
}
