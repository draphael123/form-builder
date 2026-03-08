import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <AccessibilityProvider>
            {children}
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
