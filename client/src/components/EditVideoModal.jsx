import { useEffect, useState } from "react";

import api from "../services/api";

import toast from "react-hot-toast";

import { X } from "lucide-react";

function EditVideoModal({ video, isOpen, onClose, onUpdated }) {
  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  const [categoryId, setCategoryId] = useState("");

  const [visibility, setVisibility] = useState("public");

  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(false);

  // Load categories
  useEffect(() => {
    fetchCategories();
  }, []);

  // Load video data
  useEffect(() => {
    if (video) {
      setTitle(video.title || "");

      setDescription(video.description || "");

      setCategoryId(video.categoryId || "");

      setVisibility(video.visibility || "public");
    }
  }, [video]);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");

      setCategories(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.put(`/videos/${video.id}`, {
        title,

        description,

        categoryId,

        visibility,
      });

      toast.success("✅ Video actualizado");

      onUpdated();

      onClose();
    } catch (error) {
      console.log(error);

      toast.error("❌ Error al actualizar");
    } finally {
      setLoading(false);
    }
  };

  // Close if not open
  if (!isOpen) return null;

  return (
    <div
      className="
        fixed
        inset-0
        bg-black/50
        backdrop-blur-sm
        flex
        items-center
        justify-center
        z-50
        p-4
      "
    >
      {/* Modal */}
      <div
        className="
          bg-white
          w-full
          max-w-2xl
          rounded-[35px]
          shadow-2xl
          relative
          max-h-[90vh]
          flex
          flex-col
          overflow-hidden
        "
      >
        {/* Header */}
        <div
          className="
            flex
            items-center
            justify-between
            px-10
            py-7
            border-b
            border-slate-200
            shrink-0
          "
        >
          <div>
            <h2
              className="
                text-3xl
                font-bold
                text-darkText
                mb-2
              "
            >
              Editar video
            </h2>

            <p
              className="
                text-muted
              "
            >
              Actualiza la información del video.
            </p>
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            className="
              text-slate-400
              hover:text-red-500
              transition
            "
          >
            <X size={30} />
          </button>
        </div>

        {/* Scrollable content */}
        <div
          className="
            overflow-y-auto
            px-10
            py-8
          "
        >
          <form onSubmit={handleSubmit} className="space-y-7">
            {/* Title */}
            <div>
              <label
                className="
                  block
                  mb-3
                  font-semibold
                  text-lg
                "
              >
                Título
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="
                  w-full
                  bg-slate-100
                  rounded-2xl
                  px-6
                  py-5
                  outline-none
                  text-lg
                "
                required
              />
            </div>

            {/* Description */}
            <div>
              <label
                className="
                  block
                  mb-3
                  font-semibold
                  text-lg
                "
              >
                Descripción
              </label>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                className="
                  w-full
                  bg-slate-100
                  rounded-2xl
                  px-6
                  py-5
                  outline-none
                  text-lg
                  resize-none
                "
              />
            </div>

            {/* Category */}
            <div>
              <label
                className="
                  block
                  mb-3
                  font-semibold
                  text-lg
                "
              >
                Categoría
              </label>

              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="
                  w-full
                  bg-slate-100
                  rounded-2xl
                  px-6
                  py-5
                  outline-none
                  text-lg
                "
              >
                <option value="">Sin categoría</option>

                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Visibility */}
            <div>
              <label
                className="
                  block
                  mb-3
                  font-semibold
                  text-lg
                "
              >
                Visibilidad
              </label>

              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
                className="
                  w-full
                  bg-slate-100
                  rounded-2xl
                  px-6
                  py-5
                  outline-none
                  text-lg
                "
              >
                <option value="public">Público</option>

                <option value="private">Privado</option>
              </select>
            </div>

            {/* Buttons */}
            <div
              className="
                flex
                justify-end
                gap-4
                pt-4
                sticky
                bottom-0
                bg-white
              "
            >
              <button
                type="button"
                onClick={onClose}
                className="
                  px-6
                  py-4
                  rounded-2xl
                  bg-slate-200
                  hover:bg-slate-300
                  transition
                  font-semibold
                "
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={loading}
                className="
                  px-6
                  py-4
                  rounded-2xl
                  bg-primary
                  text-white
                  hover:opacity-90
                  transition
                  font-semibold
                "
              >
                {loading ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditVideoModal;
