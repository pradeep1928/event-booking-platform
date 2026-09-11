import { Outlet } from "react-router-dom";

import Navbar from "../components/common/Navbar";

const AppLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar variant="app" />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;