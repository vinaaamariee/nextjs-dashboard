"use server";
import { SideNav } from '@/app/ui/dashboard/sidenav';
import React from 'react';

// 1. Change to 'export default'
// 2. The function name 'Layout' is optional but good for debugging
export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}