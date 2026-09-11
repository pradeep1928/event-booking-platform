import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";

const PublicLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar variant="public" />
      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 text-center text-sm text-gray-500 sm:px-6 lg:px-8">
          © {new Date().getFullYear()} Event Booking
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;