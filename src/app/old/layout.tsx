"use client"
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./components/theme.css";
import { MenuProvider } from "./context/menuContext";
import Header from "./components/header";
import SideBar from "./components/sideBarComponent";
import { Provider } from 'react-redux';
import { store } from './redux/store';


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



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
        <Provider store={store}>
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
        </Provider>
      </body>
    </html>
  );
}
