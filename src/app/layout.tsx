import Providers from "./providers";
import "./globals.css";

export const metadata = {
  title: 'MUI X antd v5 design',
  description: 'Adapter for MUI X and antd v5 design',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
