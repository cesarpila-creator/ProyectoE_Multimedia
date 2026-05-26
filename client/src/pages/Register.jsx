import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { User, Mail, Lock, Play } from "lucide-react";

import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();

  const { register } = useAuth();

  const [username, setUsername] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // EMPTY
    if (!username.trim() || !email.trim() || !password.trim()) {
      toast.error("⚠️ Todos los campos son obligatorios");

      return;
    }

    // USERNAME
    if (username.length < 3) {
      toast.error("👤 El usuario debe tener mínimo 3 caracteres");

      return;
    }

    // EMAIL
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      toast.error("📧 Ingresa un correo válido");

      return;
    }

    // PASSWORD
    if (password.length < 4) {
      toast.error("🔒 La contraseña debe tener mínimo 6 caracteres");

      return;
    }

    setLoading(true);

    const result = await register(username, email, password);

    if (result.success) {
      toast.success("🎉 Usuario creado correctamente");

      navigate("/login");
    } else {
      toast.error(result.message || "❌ Error creando usuario");
    }

    setLoading(false);
  };

  return (
    <div
      className="
        min-h-screen
        flex
        bg-[#F4F7FB]
      "
    >
      {/* LEFT */}
      <div
        className="
          hidden
          xl:flex
          w-1/2
          relative
          overflow-hidden
          items-center
          justify-center
          p-20
          bg-gradient-to-br
          from-primary
          to-[#173B70]
        "
      >
        <div
          className="
            absolute
            w-[500px]
            h-[500px]
            rounded-full
            bg-white/5
            -top-40
            -right-20
          "
        />

        <div
          className="
            absolute
            w-[300px]
            h-[300px]
            rounded-full
            bg-white/5
            -bottom-20
            -left-20
          "
        />

        <div
          className="
            relative
            z-10
            max-w-xl
          "
        >
          <div
            className="
              w-24
              h-24
              rounded-[28px]
              bg-white/10
              backdrop-blur-xl
              flex
              items-center
              justify-center
              mb-12
            "
          >
            <Play
              size={38}
              className="
                fill-white
                text-white
              "
            />
          </div>

          <h1
            className="
              text-5xl
              lg:text-6xl
              font-extrabold
              text-white
              mb-6
              tracking-tight
            "
          >
            ProyectoE
          </h1>

          <p
            className="
              text-white/80
              text-xl
              leading-relaxed
            "
          >
            Crea tu cuenta y administra tu plataforma multimedia
            profesionalmente.
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div
        className="
          flex-1
          flex
          items-center
          justify-center
          px-4
          sm:px-6
          py-10
        "
      >
        <form
          onSubmit={handleSubmit}
          className="
            w-full
            max-w-[95%]
            sm:max-w-[520px]
            bg-white
            rounded-[32px]
            p-7
            sm:p-10
            lg:p-12
            shadow-xl
            border
            border-slate-100
          "
        >
          <h1
            className="
              text-4xl
              sm:text-5xl
              font-extrabold
              text-darkText
              mb-4
              tracking-tight
            "
          >
            Crear cuenta
          </h1>

          <p
            className="
              text-muted
              text-base
              sm:text-lg
              mb-10
            "
          >
            Regístrate para comenzar.
          </p>

          {/* USERNAME */}
          <div className="mb-6">
            <label
              className="
                text-sm
                font-semibold
                text-darkText
                mb-3
                block
              "
            >
              Usuario
            </label>

            <div
              className="
                flex
                items-center
                gap-4
                h-[56px]
                sm:h-[62px]
                px-5
                rounded-2xl
                bg-[#F5F7FC]
                focus-within:ring-4
                focus-within:ring-primary/10
                transition-all
              "
            >
              <User
                size={20}
                className="
                  text-slate-400
                "
              />

              <input
                type="text"
                placeholder="Tu usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="
                  flex-1
                  bg-transparent
                  outline-none
                  text-darkText
                "
              />
            </div>
          </div>

          {/* EMAIL */}
          <div className="mb-6">
            <label
              className="
                text-sm
                font-semibold
                text-darkText
                mb-3
                block
              "
            >
              Correo electrónico
            </label>

            <div
              className="
                flex
                items-center
                gap-4
                h-[56px]
                sm:h-[62px]
                px-5
                rounded-2xl
                bg-[#F5F7FC]
                focus-within:ring-4
                focus-within:ring-primary/10
                transition-all
              "
            >
              <Mail
                size={20}
                className="
                  text-slate-400
                "
              />

              <input
                type="email"
                placeholder="correo@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="
                  flex-1
                  bg-transparent
                  outline-none
                  text-darkText
                "
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="mb-8">
            <label
              className="
                text-sm
                font-semibold
                text-darkText
                mb-3
                block
              "
            >
              Contraseña
            </label>

            <div
              className="
                flex
                items-center
                gap-4
                h-[56px]
                sm:h-[62px]
                px-5
                rounded-2xl
                bg-[#F5F7FC]
                focus-within:ring-4
                focus-within:ring-primary/10
                transition-all
              "
            >
              <Lock
                size={20}
                className="
                  text-slate-400
                "
              />

              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="
                  flex-1
                  bg-transparent
                  outline-none
                  text-darkText
                "
              />
            </div>
          </div>

          {/* BUTTON */}
          <button
            disabled={loading}
            className="
              w-full
              h-[56px]
              sm:h-[62px]
              rounded-2xl
              bg-primary
              text-white
              font-semibold
              text-base
              sm:text-lg
              shadow-lg
              hover:shadow-xl
              hover:scale-[1.01]
              active:scale-[0.99]
              transition-all
            "
          >
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>

          {/* FOOTER */}
          <p
            className="
              text-center
              mt-8
              text-sm
              text-muted
            "
          >
            ¿Ya tienes cuenta?
            <Link
              to="/login"
              className="
                text-primary
                font-semibold
                ml-2
              "
            >
              Iniciar sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
