import './globals.css';
import { IBM_Plex_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Toaster } from 'sonner';
import { ContactModalProvider } from '@/contexts/ContactModalContext';
import { CookieConsentManager } from '@/components/CookieConsentManager';
import { SkipLink } from '@/components/accessibility/SkipLink';
import ErrorBoundary from '@/components/ErrorBoundary';
import { WebVitals } from '@/components/WebVitals';

// Validate environment variables at application startup
// This import triggers validation and will fail fast if required variables are missing
import '@/config/env';

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://daltonousley.dev'),
  title: 'Dalton Ousley - Cloud-focused Engineer',
  description: 'Personal portfolio of Dalton Ousley, a cloud-focused engineer passionate about DevOps, Kubernetes, and cloud-native solutions.',
  icons: {
    icon: [
      { url: '/favicon/favicon.ico' },
      { url: '/favicon/icon1.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon/web-app-manifest-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon/web-app-manifest-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/favicon/manifest.json',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${ibmPlexMono.className} bg-background text-foreground`}>
        <ThemeProvider>
          <ContactModalProvider>
            <WebVitals />
            <SkipLink href="#main-content">Skip to main content</SkipLink>
            <div className="relative flex flex-col min-h-screen">
              <ErrorBoundary isolate>
                <Header />
              </ErrorBoundary>
              <main id="main-content" className="flex-grow">{children}</main>
              <ErrorBoundary isolate>
                <Footer />
              </ErrorBoundary>
            </div>
            <Toaster richColors position="top-right" />
            <ErrorBoundary isolate>
              <CookieConsentManager />
            </ErrorBoundary>
          </ContactModalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
