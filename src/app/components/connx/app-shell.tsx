import { Outlet } from "react-router";
import { Sidebar } from "./sidebar";
import { TopBar } from "./top-bar";

export function AppShell() {
  return (
    <div className="connx-root h-screen w-full flex bg-mist">
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
