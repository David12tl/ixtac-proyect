// src/components/page-layaout.tsx
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    // CAMBIO: Quitamos "bg-[#f8faf8]" y ponemos "bg-transparent"
    <div className="bg-transparent text-[#191c1b] min-h-screen w-full">
      <main className="w-full">
        {children}
      </main>
    </div>
  );
};

export default Layout;