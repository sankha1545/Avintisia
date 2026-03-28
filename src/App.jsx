import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./components/common/layout/Header";
import Sidebar from "./components/common/layout/Sidebar";

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex flex-col w-full min-h-screen bg-white">

      {/* HEADER */}
      <Header onMenuClick={() => setIsSidebarOpen(true)} />

      {/* LAYOUT */}
      <div className="flex flex-1 w-full pt-[52px]">

        {/* SIDEBAR */}
        <Sidebar
          currentPath={location.pathname}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onOpen={() => setIsSidebarOpen(true)}
        />

        {/* MAIN */}
        <main className="flex flex-col flex-1 w-full min-w-0 bg-content-bg">

          {/* SCROLL AREA */}
          <div className="flex-1 w-full px-3 py-4 overflow-x-hidden overflow-y-auto sm:px-4 md:px-6 lg:px-8 sm:py-6">
            <Outlet />
          </div>

        </main>
      </div>
    </div>
  );
};

export default App;