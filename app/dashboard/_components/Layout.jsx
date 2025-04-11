"use client";

import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

function Layout({ children }) {
  return (
    <div className="flex flex-col h-screen">
      {/* Header at the top */}
      <Header />

      {/* Below the header: Sidebar and main content side by side */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar on the left */}
        <Sidebar />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-800">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;
