import { Outlet } from "react-router";

import { Sidebar } from "@/components/sidebar";
import { TopHeader } from "@/components/top-header";

export function MainLayout() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopHeader />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8 md:px-12 md:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
