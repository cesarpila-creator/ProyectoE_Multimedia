import { useState } from "react";

import Sidebar from "../components/Sidebar";

import Navbar from "../components/Navbar";

function MainLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
      className="
        bg-background
        h-screen
        overflow-hidden
      "
    >
      {/* SIDEBAR */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* MAIN */}
      <main
        className="
          lg:ml-[270px]
          h-screen
          overflow-y-auto
          flex
          flex-col
          transition-all
        "
      >
        {/* NAVBAR */}
        <div
          className="
            sticky
            top-0
            z-40
            bg-background/90
            backdrop-blur-xl
            border-b
            border-slate-200
            px-4
            sm:px-6
            lg:px-10
            py-4
          "
        >
          <Navbar setSidebarOpen={setSidebarOpen} />
        </div>

        {/* CONTENT */}
        <div
          className="
            flex-1
            p-4
            sm:p-6
            lg:p-10
          "
        >
          {children}
        </div>
      </main>
    </div>
  );
}

export default MainLayout;
