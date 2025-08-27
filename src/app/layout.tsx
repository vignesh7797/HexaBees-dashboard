"use client"; // Keep this directive if you have client-side providers like Redux Provider

import { Provider } from 'react-redux'; // Example: Import the Redux Provider
import { store } from './v2/redux/store'; // Example: Import your Redux store


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="theme-blue">
      <body>
        <Provider store={store}> {/* Example: Wrap with Redux Provider */}
          {children}
        </Provider>
      </body>
    </html>
  );
}
