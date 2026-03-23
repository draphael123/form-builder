import type { Metadata } from "next";
import { Fraunces, DM_Sans } from "next/font/google";
import "./globals.css";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Toaster } from "sonner";

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "New Hire Information Form",
  description: "Complete this form with your information as a new hire.",
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  themeColor: '#2563eb',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Fountain Onboarding',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fraunces.variable} ${dmSans.variable} antialiased`}
      >
        <ThemeProvider>
          <AccessibilityProvider>
            {/* Skip to main content link for accessibility */}
            <a
              href="#main-content"
              className="skip-link"
            >
              Skip to main content
            </a>
            <main id="main-content">
              {children}
            </main>
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: 'white',
                  border: '1px solid var(--color-parchment)',
                  borderRadius: '12px',
                  boxShadow: 'var(--shadow-warm)',
                  fontFamily: 'var(--font-body)',
                },
                classNames: {
                  success: 'toast-success',
                  error: 'toast-error',
                  info: 'toast-info',
                },
              }}
              expand={false}
              richColors
            />
          </AccessibilityProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
