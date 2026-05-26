import { Home, Upload, Heart, Video, Folder, Play, X } from "lucide-react";

import { NavLink } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Sidebar({
  sidebarOpen,

  setSidebarOpen,
}) {
  const { user } = useAuth();

  const storedUser = localStorage.getItem("user");

  const currentUser = user || (storedUser ? JSON.parse(storedUser) : null);

  const menu = [
    {
      name: "Inicio",
      icon: Home,
      path: "/",
    },

    {
      name: "Subir Video",
      icon: Upload,
      path: "/upload",
    },

    {
      name: "Favoritos",
      icon: Heart,
      path: "/favorites",
    },

    {
      name: "Mis Videos",
      icon: Video,
      path: "/my-videos",
    },

    {
      name: "Categorías",
      icon: Folder,
      path: "/categories",
    },
  ];

  return (
    <>
      {/* OVERLAY */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="
            fixed
            inset-0
            bg-black/50
            z-40
            lg:hidden
          "
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          
          fixed
          top-0
          left-0
          w-[270px]
          h-screen
          bg-primary
          text-white
          px-6
          py-8
          flex
          flex-col
          justify-between
          shadow-2xl
          z-50
          transition-all
          duration-300

          ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        {/* TOP */}
        <div>
          {/* MOBILE CLOSE */}
          <div
            className="
              flex
              justify-end
              mb-4
              lg:hidden
            "
          >
            <button onClick={() => setSidebarOpen(false)}>
              <X size={28} />
            </button>
          </div>

          {/* LOGO */}
          <div className="mb-14">
            <div
              className="
                w-14
                h-14
                rounded-3xl
                bg-white/10
                flex
                items-center
                justify-center
                mb-5
              "
            >
              <Play
                size={24}
                className="
                  fill-white
                  text-white
                "
              />
            </div>

            <h1
              className="
                text-4xl
                font-extrabold
                tracking-tight
              "
            >
              ProyectoE
            </h1>
          </div>

          {/* MENU */}
          <nav
            className="
              flex
              flex-col
              gap-2
            "
          >
            {menu.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) => `
                    
                    group
                    flex
                    items-center
                    gap-4
                    px-5
                    py-4
                    rounded-2xl
                    text-[17px]
                    font-medium
                    transition-all
                    duration-200

                    ${
                      isActive
                        ? `
                          bg-white/15
                          backdrop-blur-md
                          border
                          border-white/10
                          shadow-xl
                        `
                        : `
                          hover:bg-white/10
                          hover:translate-x-1
                        `
                    }
                  `}
                >
                  <Icon
                    size={21}
                    className="
                      transition
                      group-hover:scale-110
                    "
                  />

                  {item.name}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* USER */}
        <div
          className="
            border-t
            border-white/10
            pt-5
          "
        >
          <div
            className="
              flex
              items-center
              gap-4
            "
          >
            {/* AVATAR */}
            <div
              className="
                w-12
                h-12
                rounded-full
                bg-white/10
                flex
                items-center
                justify-center
                text-lg
                font-bold
                shrink-0
              "
            >
              {currentUser?.username?.charAt(0)?.toUpperCase()}
            </div>

            {/* INFO */}
            <div>
              <h3
                className="
                  text-base
                  font-semibold
                  leading-none
                "
              >
                {currentUser?.username}
              </h3>

              <p
                className="
                  text-white/70
                  text-sm
                  mt-1
                "
              >
                Usuario activo
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
