import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { Mail, Lock, Play } from "lucide-react";

import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // VALIDATIONS
    if (!email.trim() || !password.trim()) {
      toast.error("⚠️ Todos los campos son obligatorios");

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

    const result = await login(email, password);

    if (result.success) {
      toast.success("✅ Inicio de sesión exitoso");

      navigate("/");
    } else {
      toast.error(result.message || "❌ Error iniciando sesión");
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
        {/* CIRCLES */}
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
          {/* LOGO */}
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

          {/* TITLE */}
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

          {/* TEXT */}
          <p
            className="
              text-white/80
              text-xl
              leading-relaxed
            "
          >
            Plataforma multimedia profesional para gestionar y distribuir
            contenido audiovisual.
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
          {/* TITLE */}
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
            Iniciar sesión
          </h1>

          <p
            className="
              text-muted
              text-base
              sm:text-lg
              mb-10
            "
          >
            Accede a tu cuenta para continuar.
          </p>

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
                border
                border-transparent
                focus-within:border-primary
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
                  text-[15px]
                  sm:text-[16px]
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
                border
                border-transparent
                focus-within:border-primary
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
                  text-[15px]
                  sm:text-[16px]
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
              disabled:opacity-70
            "
          >
            {loading ? "Ingresando..." : "Ingresar"}
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
            ¿No tienes cuenta?
            <Link
              to="/register"
              className="
                text-primary
                font-semibold
                ml-2
              "
            >
              Crear cuenta
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
