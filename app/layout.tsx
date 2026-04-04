import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  // Basis SEO
  title: 'Pizzeria Napoli | Beste Pizza in Haßlinghausen & Sprockhövel',
  description: '🍕 Die beste Pizza in Haßlinghausen! Handgemachte Pizzen, frische Pasta, Schnitzel, Salate und Gyros. Lieferung frei Haus ab 10€. Jetzt online bestellen!',
  keywords: 'Pizzeria Haßlinghausen, Pizza Haßlinghausen, Pizzeria Sprockhövel, Pizza Sprockhövel, Pizzeria Napoli, Pizza bestellen, Lieferdienst Haßlinghausen, italienische Küche, Pasta, Schnitzel, Gyros, Salate, Gevelsberg, Pizzeria Napoli Haßlinghausen, Pizza Lieferung, Pizzeria in der Nähe',
  robots: 'index, follow',
  authors: [{ name: 'Pizzeria Napoli', url: 'https://pizzeria-napoli-gevelsberg.vercel.app' }],
  creator: 'Pizzeria Napoli',
  publisher: 'Pizzeria Napoli',
  metadataBase: new URL('https://pizzeria-napoli-gevelsberg.vercel.app'),
  alternates: {
    canonical: 'https://pizzeria-napoli-gevelsberg.vercel.app',
    languages: {
      'de-DE': 'https://pizzeria-napoli-gevelsberg.vercel.app',
    },
  },
  
  // Open Graph (Facebook, WhatsApp, LinkedIn, Telegram)
  openGraph: {
    title: 'Pizzeria Napoli | Beste Pizza in Haßlinghausen',
    description: '🍕 Handgemachte Pizzen, frische Pasta, Schnitzel & mehr. Lieferung frei Haus ab 10€. Jetzt online bestellen!',
    url: 'https://pizzeria-napoli-gevelsberg.vercel.app',
    siteName: 'Pizzeria Napoli',
    locale: 'de_DE',
    type: 'website',
    images: [
      {
        url: '/images/pizza.png',
        width: 1200,
        height: 630,
        alt: 'Pizzeria Napoli - Beste Pizza in Haßlinghausen',
      },
    ],
    emails: ['info@pizzeria-napoli.de'],
    phoneNumbers: ['023399116727'],
  },
  
  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'Pizzeria Napoli | Beste Pizza in Haßlinghausen',
    description: '🍕 Handgemachte Pizzen, frische Pasta, Schnitzel & mehr. Lieferung frei Haus ab 10€!',
    images: ['/images/pizza.png'],
    site: '@pizzeria_napoli',
    creator: '@pizzeria_napoli',
  },
  
  // Icons
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: '/apple-touch-icon.png',
  },
  
  // Weitere SEO
  category: 'restaurant',
  classification: 'Italian Restaurant, Pizzeria, Delivery Service',
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  referrer: 'origin-when-cross-origin',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  verification: {
    google: 'google4844ad6147a796ec',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
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
        {/* Lokale Geschäftsdaten für Google (JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
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
              "openingHours": ["Mo-Su 11:00-22:00"],
              "openingHoursSpecification": [
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                  "opens": "11:00",
                  "closes": "22:00"
                }
              ],
              "priceRange": "€€",
              "servesCuisine": ["Italian", "Pizza", "Pasta", "Schnitzel", "Gyros", "Salads"],
              "image": "https://pizzeria-napoli-gevelsberg.vercel.app/images/pizza.png",
              "url": "https://pizzeria-napoli-gevelsberg.vercel.app",
              "sameAs": [
                "https://www.facebook.com/pizzeria-napoli",
                "https://www.instagram.com/pizzeria_napoli"
              ],
              "hasMenu": "https://pizzeria-napoli-gevelsberg.vercel.app/menu",
              "acceptsReservations": false,
              "deliveryArea": {
                "@type": "GeoCircle",
                "geoMidpoint": {
                  "@type": "GeoCoordinates",
                  "latitude": "51.360",
                  "longitude": "7.240"
                },
                "geoRadius": "5000"
              }
            })
          }}
        />
        
        {/* Zusätzliche Meta-Tags für lokale Suche */}
        <meta name="geo.region" content="DE-NW" />
        <meta name="geo.placename" content="Sprockhövel" />
        <meta name="geo.position" content="51.360;7.240" />
        <meta name="ICBM" content="51.360, 7.240" />
        <meta name="city" content="Sprockhövel" />
        <meta name="area" content="Haßlinghausen" />
        
        {/* Google Search Console */}
        <meta name="google-site-verification" content="google4844ad6147a796ec" />
      </head>
      <body>{children}</body>
    </html>
  );
}
