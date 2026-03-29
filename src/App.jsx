import { useState, useEffect, useCallback } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./components/common/layout/Header";
import Sidebar from "./components/common/layout/Sidebar";

const HEADER_HEIGHT = 52; // central control

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // ✅ Stable handlers (performance)
  const openSidebar = useCallback(() => setIsSidebarOpen(true), []);
  const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);

  // ✅ Auto close sidebar on route change (IMPORTANT UX FIX)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex flex-col w-full min-h-screen overflow-hidden bg-white">

      {/* HEADER */}
      <Header onMenuClick={openSidebar} />

      {/* LAYOUT */}
      <div
        className="flex flex-1 w-full"
        style={{ paddingTop: HEADER_HEIGHT }}
      >

        {/* SIDEBAR */}
        <Sidebar
          currentPath={location.pathname}
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
          onOpen={openSidebar}
        />

        {/* MAIN */}
        <main className="flex flex-col flex-1 w-full min-w-0 bg-content-bg">

          {/* SCROLLABLE CONTENT */}
          <div className="relative flex-1 w-full px-3 py-4 overflow-x-hidden overflow-y-auto scroll-smooth sm:px-4 md:px-6 lg:px-8 sm:py-6">
            <Outlet />
          </div>

        </main>
      </div>
    </div>
  );
};

export default App;