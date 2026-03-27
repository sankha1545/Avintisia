import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./components/common/Header";
import Sidebar from "./components/common/Sidebar";

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Track current route
  const location = useLocation();

  return (
    <div className="h-screen bg-white overflow-hidden">

      {/* ───────── HEADER ───────── */}
      <Header onMenuClick={() => setIsSidebarOpen(true)} />

      {/* ───────── LAYOUT ───────── */}
      <div className="flex pt-[52px] h-[calc(100vh-52px)]">

        {/* ───────── SIDEBAR ───────── */}
       <Sidebar
  currentPath={location.pathname}
  isOpen={isSidebarOpen}
  onClose={() => setIsSidebarOpen(false)}
  onOpen={() => setIsSidebarOpen(true)}   // ✅ ADD THIS
/>

        {/* ───────── MAIN CONTENT ───────── */}
        <main className="flex-1 flex flex-col bg-content-bg">

          {/* Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>

        </main>
      </div>
    </div>
  );
};

export default App;