import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MenuProvider } from "./context/menuContext";
import Header from "./components/header";
import SideBar from "./components/sideBarComponent";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Billing Software | Hexa Bees Enterprise",
  description: "Discover and order from the best restaurants near you. Reserve tables, browse menus, track orders, and enjoy exclusive discounts with Hexa Bees. Elevate your dining experience today!",
  icons : {
    icon : "/favicon.svg",
    shortcut : "/favicon.svg",
    apple : "/favicon.svg",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100`}
      >
        <main className="print:mt-2 flex bg-[#EAEAEA] overflow-hidden h-screen print:h-fit w-screen">
          <SideBar />
          <div className="w-full">
            <Header />
              <section className="overflow-auto h-[-webkit-fill-available] print:h-fit">
                <MenuProvider>
                  {children}
                </MenuProvider>
              </section>
          </div>
        </main>

      </body>
    </html>
  );
}
