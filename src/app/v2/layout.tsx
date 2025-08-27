// src/app/v2/layout.tsx

"use client"

import React, { useState, useEffect } from 'react';
import './theme.css'; // Import your theme CSS

// You'll import your custom components here later
// import Header from './components/Header/Header';
// import Sidebar from './components/Sidebar/Sidebar';


export default function V2Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // State to manage the selected color palette (e.g., 'blue', 'orange')
  const [selectedColorPalette, setSelectedColorPalette] = useState('blue'); // Default palette

  // State to manage dark mode
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Effect to apply theme classes to the html tag
  useEffect(() => {
    const htmlElement = document.documentElement;

    // Apply dark mode class
    if (isDarkMode) {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }

    // Remove previous theme color classes
    htmlElement.classList.forEach(className => {
      if (className.startsWith('theme-')) {
        htmlElement.classList.remove(className);
      }
    });

    // Apply the selected theme color class
    if (selectedColorPalette && selectedColorPalette !== 'blue') { // Apply class if not default 'blue'
        htmlElement.classList.add(`theme-${selectedColorPalette}`);
    }


    // Save theme preference to localStorage
    localStorage.setItem('themePreference', JSON.stringify({ color: selectedColorPalette, mode: isDarkMode }));

  }, [selectedColorPalette, isDarkMode]); // Re-run effect when theme state changes

  // Effect to load theme preference from localStorage on initial mount
  useEffect(() => {
    const savedThemePreference = localStorage.getItem('themePreference');
    if (savedThemePreference) {
      try {
        const { color, mode } = JSON.parse(savedThemePreference);
        setSelectedColorPalette(color || 'blue');
        setIsDarkMode(mode || false);
      } catch (error) {
        console.error("Failed to parse theme preference from localStorage", error);
        // Handle potential errors in parsing localStorage data
      }
    }
  }, []); // Run only once on initial mount


  // Functions to update theme state (will be passed to Header later)
  const handleColorPaletteChange = (color: string) => {
    setSelectedColorPalette(color);
  };

  const handleDarkModeToggle = (checked: boolean) => {
    setIsDarkMode(checked);
  };


  // ... sidebar state and toggle logic (will integrate with Drawer later) ...
  // For now, a placeholder state
   const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Default to closed on mobile-first thinking

   const toggleSidebar = () => {
     setIsSidebarOpen(!isSidebarOpen);
   };


  return (
    <div className="flex h-screen">
      {/* Sidebar/Drawer (will use custom Drawer component later) */}
      {/* <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} /> */}
       {/* Placeholder for content area */}

      {/* Main Content Area - Adjust margin based on sidebar state and screen size */}
      {/* On medium screens and above, apply ml-64 when sidebar is open */}
      <div className={`flex-1 flex flex-col ${isSidebarOpen ? 'md:ml-64' : 'md:ml-0'} transition-all duration-200`}>
        {/* Header (will use custom Header component later) */}
        {/* <Header
            onToggleSidebar={toggleSidebar}
            isDarkMode={isDarkMode}
            onDarkModeToggle={handleDarkModeToggle}
            selectedColorPalette={selectedColorPalette}
            onColorPaletteChange={handleColorPaletteChange}
         /> */}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4">
          {/* Page content */}
          {children}
        </main>
      </div>
    </div>
  );
}
