
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/context/UserContext";
import AuthLayoutWrapper from "@/components/AuthLayoutWrapper";
import { PreferencesProvider } from "@/context/PreferencesContext";
import { AnimationProvider } from "@/context/AnimationContext";
import LenisProvider from "@/components/LenisProvider";
import ErrorBoundary from "@/components/ErrorBoundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "GreenCommunity - Sustainable Living Dashboard",
  description: "Track and reduce your carbon footprint with our comprehensive environmental impact dashboard",
  other: {
    'format-detection': 'telephone=no, date=no, email=no, address=no',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <ErrorBoundary>
          <LenisProvider>
            <PreferencesProvider>
              <AnimationProvider>
                <UserProvider>
                  <AuthLayoutWrapper>{children}</AuthLayoutWrapper>
                </UserProvider>
              </AnimationProvider>
            </PreferencesProvider>
          </LenisProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}