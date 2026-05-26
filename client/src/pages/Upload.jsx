import { useEffect, useState } from "react";

import { UploadCloud, Loader2 } from "lucide-react";

import { useDropzone } from "react-dropzone";

import toast from "react-hot-toast";

import api from "../services/api";

function Upload() {
  const [video, setVideo] = useState(null);

  const [preview, setPreview] = useState("");

  const [categories, setCategories] = useState([]);

  const [uploading, setUploading] = useState(false);

  const [progress, setProgress] = useState(0);

  const [formData, setFormData] = useState({
    title: "",

    description: "",

    visibility: "public",

    categoryId: "",
  });

  // Load categories
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");

      setCategories(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Dropzone
  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];

    if (!file) return;

    setVideo(file);

    setPreview(URL.createObjectURL(file));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,

    accept: {
      "video/*": [],
    },

    multiple: false,
  });

  // Handle input
  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });
  };

  // Upload
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!video) {
      return toast.error("Selecciona un video");
    }

    if (!formData.title) {
      return toast.error("Ingresa un título");
    }

    try {
      setUploading(true);

      const data = new FormData();

      data.append("video", video);

      data.append("title", formData.title);

      data.append("description", formData.description);

      data.append("visibility", formData.visibility);

      data.append("categoryId", formData.categoryId);

      await api.post("/videos/upload", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },

        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );

          setProgress(percent);
        },
      });

      toast.success("🎉 Video subido correctamente");

      // Reset
      setVideo(null);

      setPreview("");

      setProgress(0);

      setFormData({
        title: "",

        description: "",

        visibility: "public",

        categoryId: "",
      });
    } catch (error) {
      console.log(error);

      toast.error("Error al subir video");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-10">
      {/* Header */}
      <div className="mb-10">
        <h2 className="text-4xl font-bold text-darkText">Subir Video</h2>

        <p className="text-muted mt-2">
          Comparte contenido multimedia con tu comunidad.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        {/* LEFT */}
        <div className="space-y-8">
          {/* DROPZONE */}
          <div
            {...getRootProps()}
            className={`
              border-2
              border-dashed
              rounded-3xl
              p-14
              transition-all
              cursor-pointer
              text-center
              bg-white
              shadow-sm

              ${isDragActive ? "border-primary bg-blue-50" : "border-slate-300"}
            `}
          >
            <input {...getInputProps()} />

            <div className="flex flex-col items-center">
              <div
                className="
                  w-24
                  h-24
                  rounded-full
                  bg-blue-100
                  flex
                  items-center
                  justify-center
                  mb-6
                "
              >
                <UploadCloud size={42} className="text-primary" />
              </div>

              <h3 className="text-2xl font-semibold mb-3">
                Arrastra tu video aquí
              </h3>

              <p className="text-muted">o haz clic para seleccionar</p>
            </div>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleUpload}
            className="
              bg-white
              rounded-3xl
              p-8
              shadow-sm
              space-y-6
            "
          >
            {/* Title */}
            <div>
              <label className="block mb-2 font-semibold">Título</label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Título del video"
                className="
                  w-full
                  bg-slate-100
                  rounded-2xl
                  px-5
                  py-4
                  outline-none
                "
              />
            </div>

            {/* Description */}
            <div>
              <label className="block mb-2 font-semibold">Descripción</label>

              <textarea
                rows="5"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe tu video..."
                className="
                  w-full
                  bg-slate-100
                  rounded-2xl
                  px-5
                  py-4
                  outline-none
                  resize-none
                "
              />
            </div>

            {/* Category */}
            <div>
              <label className="block mb-2 font-semibold">Categoría</label>

              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="
                  w-full
                  bg-slate-100
                  rounded-2xl
                  px-5
                  py-4
                  outline-none
                "
              >
                <option value="">Selecciona categoría</option>

                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Visibility */}
            <div>
              <label className="block mb-2 font-semibold">Visibilidad</label>

              <select
                name="visibility"
                value={formData.visibility}
                onChange={handleChange}
                className="
                  w-full
                  bg-slate-100
                  rounded-2xl
                  px-5
                  py-4
                  outline-none
                "
              >
                <option value="public">Público</option>

                <option value="private">Privado</option>
              </select>
            </div>

            {/* Progress */}
            {uploading && (
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Subiendo...</span>

                  <span className="text-sm font-medium">{progress}%</span>
                </div>

                <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="
                      h-full
                      bg-primary
                      transition-all
                    "
                    style={{
                      width: `${progress}%`,
                    }}
                  ></div>
                </div>
              </div>
            )}

            {/* Button */}
            <button
              disabled={uploading}
              className="
                w-full
                bg-primary
                hover:bg-blue-700
                transition
                text-white
                rounded-2xl
                py-4
                font-semibold
                text-lg
                flex
                items-center
                justify-center
                gap-3
              "
            >
              {uploading ? (
                <>
                  <Loader2 className="animate-spin" />
                  Subiendo...
                </>
              ) : (
                <>
                  <UploadCloud />
                  Subir Video
                </>
              )}
            </button>
          </form>
        </div>

        {/* RIGHT PREVIEW */}
        <div
          className="
            bg-white
            rounded-3xl
            shadow-sm
            p-6
            flex
            items-center
            justify-center
            min-h-[500px]
          "
        >
          {preview ? (
            <video
              src={preview}
              controls
              className="
                w-full
                rounded-2xl
                max-h-[700px]
                bg-black
              "
            />
          ) : (
            <div className="text-center">
              <div
                className="
                  w-24
                  h-24
                  rounded-full
                  bg-slate-100
                  flex
                  items-center
                  justify-center
                  mx-auto
                  mb-5
                "
              >
                <UploadCloud size={40} className="text-slate-400" />
              </div>

              <h3 className="text-2xl font-semibold mb-2">Preview del video</h3>

              <p className="text-muted">
                Aquí aparecerá tu video antes de subirlo.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Upload;
