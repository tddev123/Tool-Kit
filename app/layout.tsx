import DeployButton from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";
import ParticlesComponent from "@/components/Particles";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* HEADER */}
          <header className="fixed top-0 left-0 w-full bg-black backdrop-blur-md shadow-md z-50">
            <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
              <Link href="/" className="text-xl font-bold text-white tracking-wide">
                MyApp
              </Link>
              <nav className="flex space-x-6 text-white font-medium">
                <Link href="/">Home</Link>
                <Link href="/features">Features</Link>
                <Link href="/pricing">Pricing</Link>
                <Link href="/">More Tools</Link>
              </nav>
              {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
            </div>
          </header>

          <main className="min-h-screen flex flex-col items-center pt-20">
            <div className="flex-1 w-full flex flex-col gap-20 items-center">
              <div className="flex flex-col gap-20 max-w-5xl p-5">{children}</div>
            </div>
          </main>

         {/* FOOTER */}
<footer className="w-full bg-black backdrop-blur-md shadow-md text-white py-4">
  <div className="max-w-6xl mx-auto flex justify-between items-center px-4">
    {/* Logo */}
    <Link href="/" className="text-xl font-bold text-white tracking-wide">
      My APP
    </Link>

    {/* Quick Links */}
    <nav className="flex space-x-6 text-white font-medium">
      <Link href="/" className="hover:text-gray-400">Contact</Link>

    </nav>
  </div>

  {/* Copyright */}
  <div className="text-center text-sm text-gray-400 mt-4">
    © {new Date().getFullYear()} MyApp. All rights reserved.
  </div>
</footer>

        </ThemeProvider>
      </body>
    </html>
  );
}