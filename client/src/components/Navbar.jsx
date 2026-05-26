import { useState } from "react";

import {
  Bell,
  Search,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
} from "lucide-react";

import { useSearch } from "../context/SearchContext";

import { useAuth } from "../context/AuthContext";

function Navbar({ setSidebarOpen }) {
  const { search, setSearch } = useSearch();

  const { user, logout } = useAuth();

  // PERSIST USER
  const storedUser = localStorage.getItem("user");

  const currentUser = user || (storedUser ? JSON.parse(storedUser) : null);

  const [open, setOpen] = useState(false);

  return (
    <header
      className="
        flex
        items-center
        justify-between
        gap-3
        sm:gap-6
        relative
        z-40
      "
    >
      {/* LEFT */}
      <div
        className="
          flex
          items-center
          gap-3
          flex-1
        "
      >
        {/* MOBILE MENU */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="
            lg:hidden
            w-12
            h-12
            rounded-xl
            bg-white
            border
            border-slate-100
            flex
            items-center
            justify-center
            shadow-sm
            shrink-0
          "
        >
          <Menu size={22} />
        </button>

        {/* SEARCH */}
        <div
          className="
            flex
            items-center
            gap-3
            bg-white
            rounded-2xl
            px-4
            sm:px-6
            h-[56px]
            sm:h-[62px]
            w-full
            shadow-sm
            border
            border-slate-100
            transition-all
            focus-within:border-primary
            focus-within:shadow-md
          "
        >
          <Search
            size={20}
            className="
              text-slate-400
              shrink-0
            "
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar videos..."
            className="
              w-full
              outline-none
              bg-transparent
              text-darkText
              text-[15px]
              sm:text-[16px]
              font-medium
              placeholder:text-slate-400
            "
          />
        </div>
      </div>

      {/* RIGHT */}
      <div
        className="
          flex
          items-center
          gap-3
          sm:gap-5
          relative
        "
      >
        {/* NOTIFICATIONS */}
        <button
          className="
            relative
            hidden
            sm:flex
            w-12
            h-12
            rounded-xl
            bg-white
            border
            border-slate-100
            items-center
            justify-center
            text-slate-500
            hover:text-primary
            hover:shadow-md
            transition-all
          "
        >
          <Bell size={22} />

          {/* DOT */}
          <span
            className="
              absolute
              top-2
              right-2
              w-2.5
              h-2.5
              bg-red-500
              rounded-full
            "
          ></span>
        </button>

        {/* USER */}
        <button
          onClick={() => setOpen(!open)}
          className="
            flex
            items-center
            gap-3
            bg-white
            border
            border-slate-100
            rounded-2xl
            px-2
            sm:px-3
            py-2
            shadow-sm
            hover:shadow-md
            transition-all
          "
        >
          {/* AVATAR */}
          <div
            className="
              w-11
              h-11
              sm:w-12
              sm:h-12
              rounded-full
              bg-primary
              text-white
              flex
              items-center
              justify-center
              text-base
              sm:text-lg
              font-bold
              shrink-0
            "
          >
            {currentUser?.username?.charAt(0)?.toUpperCase()}
          </div>

          {/* INFO */}
          <div
            className="
              hidden
              md:flex
              flex-col
              items-start
            "
          >
            <span
              className="
                text-sm
                font-semibold
                text-darkText
                leading-none
              "
            >
              {currentUser?.username}
            </span>

            <span
              className="
                text-xs
                text-muted
                mt-1
              "
            >
              Online
            </span>
          </div>

          <ChevronDown
            size={18}
            className="
              hidden
              sm:block
              text-slate-400
            "
          />
        </button>

        {/* DROPDOWN */}
        {open && (
          <div
            className="
              absolute
              top-16
              sm:top-20
              right-0
              w-[260px]
              sm:w-[290px]
              bg-white
              rounded-[30px]
              shadow-2xl
              border
              border-slate-100
              overflow-hidden
              z-[999]
            "
          >
            {/* USER INFO */}
            <div
              className="
                p-6
                border-b
                border-slate-100
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
                    w-14
                    h-14
                    rounded-full
                    bg-primary
                    text-white
                    flex
                    items-center
                    justify-center
                    text-xl
                    font-bold
                  "
                >
                  {currentUser?.username?.charAt(0)?.toUpperCase()}
                </div>

                {/* INFO */}
                <div>
                  <h3
                    className="
                      text-lg
                      font-bold
                      text-darkText
                    "
                  >
                    {currentUser?.username}
                  </h3>

                  <p
                    className="
                      text-sm
                      text-muted
                      mt-1
                      break-all
                    "
                  >
                    {currentUser?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* MENU */}
            <div className="p-3">
              {/* PROFILE */}
              <button
                className="
                  w-full
                  flex
                  items-center
                  gap-4
                  px-5
                  py-4
                  rounded-2xl
                  hover:bg-slate-100
                  transition-all
                  text-darkText
                  text-[15px]
                  sm:text-[16px]
                  font-medium
                "
              >
                <User size={20} />
                Perfil
              </button>

              {/* SETTINGS */}
              <button
                className="
                  w-full
                  flex
                  items-center
                  gap-4
                  px-5
                  py-4
                  rounded-2xl
                  hover:bg-slate-100
                  transition-all
                  text-darkText
                  text-[15px]
                  sm:text-[16px]
                  font-medium
                "
              >
                <Settings size={20} />
                Configuración
              </button>

              {/* LOGOUT */}
              <button
                onClick={logout}
                className="
                  w-full
                  flex
                  items-center
                  gap-4
                  px-5
                  py-4
                  rounded-2xl
                  text-red-500
                  hover:bg-red-50
                  transition-all
                  text-[15px]
                  sm:text-[16px]
                  font-medium
                "
              >
                <LogOut size={20} />
                Cerrar sesión
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
