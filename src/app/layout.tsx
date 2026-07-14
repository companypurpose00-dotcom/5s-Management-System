import type { Metadata, Viewport } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: '5S ProAudit — Enterprise Audit Management System',
    template: '%s | 5S ProAudit',
  },
  description:
    'Enterprise-grade 5S Audit Management Platform. Streamline department audits, track compliance, manage corrective actions, and gain AI-powered insights.',
  keywords: ['5S audit', 'audit management', 'compliance', 'CAPA', 'enterprise', 'quality management'],
  authors: [{ name: '5S ProAudit' }],
  creator: '5S ProAudit',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://your-domain.netlify.app',
    title: '5S ProAudit — Enterprise Audit Management System',
    description: 'Enterprise-grade 5S Audit Management Platform',
    siteName: '5S ProAudit',
  },
  twitter: {
    card: 'summary_large_image',
    title: '5S ProAudit',
    description: 'Enterprise-grade 5S Audit Management Platform',
  },
  robots: {
    index: false, // Private enterprise app
    follow: false,
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0b0f1a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
