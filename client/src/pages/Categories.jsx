import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { FolderPlus, Pencil, Trash2 } from "lucide-react";

import toast from "react-hot-toast";

import api from "../services/api";

function Categories() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState("");

  const [editingId, setEditingId] = useState(null);

  // Load categories
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");

      setCategories(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Create or update
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(`/categories/${editingId}`, {
          name,
        });

        toast.success("Categoría actualizada");
      } else {
        await api.post("/categories", {
          name,
        });

        toast.success("Categoría creada correctamente");
      }

      setName("");

      setEditingId(null);

      setShowModal(false);

      fetchCategories();
    } catch (error) {
      console.log(error);

      toast.error("Error");
    }
  };

  // Edit category
  const handleEdit = (category) => {
    setName(category.name);

    setEditingId(category.id);

    setShowModal(true);
  };

  // Delete category
  const handleDelete = async (id) => {
    try {
      await api.delete(`/categories/${id}`);

      toast.success("Categoría eliminada");

      fetchCategories();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error eliminando categoría",
      );
    }
  };

  return (
    <div className="p-10">
      {/* Header */}
      <div
        className="
          flex
          flex-col
          md:flex-row
          md:items-center
          md:justify-between
          gap-6
          mb-12
        "
      >
        <div>
          <h1
            className="
              text-4xl
              font-semibold
              text-darkText
            "
          >
            Categorías
          </h1>

          <p
            className="
              text-base
              text-muted
              mt-2
            "
          >
            Organiza tu contenido multimedia.
          </p>
        </div>

        {/* Button */}
        <button
          onClick={() => {
            setEditingId(null);

            setName("");

            setShowModal(true);
          }}
          className="
            bg-primary
            text-white
            px-6
            py-4
            rounded-2xl
            flex
            items-center
            gap-3
            text-base
            font-medium
            hover:scale-105
            transition
            shadow-md
          "
        >
          <FolderPlus size={22} />
          Nueva categoría
        </button>
      </div>

      {/* Categories Grid */}
      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-3
          gap-8
        "
      >
        {categories.map((category) => (
          <div
            key={category.id}
            className="
              bg-card
              rounded-[28px]
              p-7
              shadow-md
              hover:shadow-xl
              hover:-translate-y-1
              transition-all
            "
          >
            {/* Icon */}
            <div
              className="
                w-16
                h-16
                rounded-2xl
                bg-blue-100
                flex
                items-center
                justify-center
                mb-5
              "
            >
              <FolderPlus size={28} className="text-primary" />
            </div>

            {/* Name */}
            <h2
              className="
                text-xl
                font-semibold
                text-darkText
                leading-tight
                break-words
                mb-2
              "
            >
              {category.name}
            </h2>

            {/* Videos count */}
            <p
              className="
                text-sm
                text-muted
                mb-6
              "
            >
              {category.totalVideos || 0} videos
            </p>

            {/* Actions */}
            <div className="flex gap-3">
              {/* View */}
              <button
                onClick={() => navigate(`/categories/${category.id}`)}
                className="
                  flex-1
                  bg-primary
                  text-white
                  py-3
                  rounded-2xl
                  text-sm
                  font-medium
                  hover:bg-blue-700
                  transition
                "
              >
                Ver videos
              </button>

              {/* Edit */}
              <button
                onClick={() => handleEdit(category)}
                className="
                  w-12
                  h-12
                  rounded-2xl
                  bg-blue-100
                  flex
                  items-center
                  justify-center
                  hover:scale-105
                  transition
                "
              >
                <Pencil size={18} className="text-primary" />
              </button>

              {/* Delete */}
              <button
                onClick={() => handleDelete(category.id)}
                className="
                  w-12
                  h-12
                  rounded-2xl
                  bg-red-100
                  flex
                  items-center
                  justify-center
                  hover:scale-105
                  transition
                "
              >
                <Trash2 size={18} className="text-red-500" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="
            fixed
            inset-0
            bg-black/40
            flex
            items-center
            justify-center
            z-50
            p-4
          "
        >
          <div
            className="
              bg-white
              w-full
              max-w-[500px]
              rounded-[30px]
              p-8
              shadow-2xl
            "
          >
            {/* Title */}
            <h2
              className="
                text-2xl
                font-semibold
                text-darkText
                mb-6
              "
            >
              {editingId ? "Editar categoría" : "Nueva categoría"}
            </h2>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  className="
                    block
                    text-sm
                    font-medium
                    mb-2
                  "
                >
                  Nombre categoría
                </label>

                <input
                  type="text"
                  placeholder="Ej: Tutoriales"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="
                    w-full
                    bg-background
                    rounded-2xl
                    px-5
                    py-4
                    outline-none
                    text-base
                    border
                    border-transparent
                    focus:border-primary
                    transition
                  "
                  required
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="
                    flex-1
                    bg-slate-200
                    py-3
                    rounded-2xl
                    text-sm
                    font-medium
                    hover:bg-slate-300
                    transition
                  "
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="
                    flex-1
                    bg-primary
                    text-white
                    py-3
                    rounded-2xl
                    text-sm
                    font-medium
                    hover:bg-blue-700
                    transition
                  "
                >
                  {editingId ? "Guardar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Categories;
