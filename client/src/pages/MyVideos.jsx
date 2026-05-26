import { useEffect, useState } from "react";

import api from "../services/api";

import VideoCard from "../components/VideoCard";

import EditVideoModal from "../components/EditVideoModal";

import toast from "react-hot-toast";

import { Pencil, Trash2, Video } from "lucide-react";

function MyVideos() {
  const [videos, setVideos] = useState([]);

  const [loading, setLoading] = useState(true);

  const [selectedVideo, setSelectedVideo] = useState(null);

  const [isEditOpen, setIsEditOpen] = useState(false);

  // Load
  useEffect(() => {
    fetchMyVideos();
  }, []);

  // Fetch videos
  const fetchMyVideos = async () => {
    try {
      const response = await api.get("/videos/my-videos");

      setVideos(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Open edit
  const handleEdit = (video) => {
    setSelectedVideo(video);

    setIsEditOpen(true);
  };

  // Delete
  const handleDelete = async (videoId) => {
    const confirmDelete = window.confirm("¿Eliminar este video?");

    if (!confirmDelete) return;

    try {
      await api.delete(`/videos/${videoId}`);

      toast.success("🗑️ Video eliminado");

      // Refresh
      fetchMyVideos();
    } catch (error) {
      console.log(error);

      toast.error("❌ Error eliminando video");
    }
  };

  // Loading
  if (loading) {
    return (
      <div
        className="
          flex
          items-center
          justify-center
          h-[60vh]
        "
      >
        <div className="text-center">
          <div
            className="
              w-16
              h-16
              border-4
              border-primary
              border-t-transparent
              rounded-full
              animate-spin
              mx-auto
              mb-5
            "
          ></div>

          <p
            className="
              text-lg
              text-muted
              font-medium
            "
          >
            Cargando videos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10">
      {/* Header */}
      <div
        className="
          flex
          items-center
          gap-5
          mb-12
        "
      >
        <div
          className="
            w-16
            h-16
            rounded-2xl
            bg-blue-100
            flex
            items-center
            justify-center
          "
        >
          <Video
            size={30}
            className="
              text-primary
            "
          />
        </div>

        <div>
          <h1
            className="
              text-4xl
              font-semibold
              text-darkText
            "
          >
            Mis Videos
          </h1>

          <p
            className="
              text-base
              text-muted
              mt-1
            "
          >
            Administra todos tus videos subidos.
          </p>
        </div>
      </div>

      {/* Stats */}
      {videos.length > 0 && (
        <div
          className="
            mb-10
            bg-white
            rounded-3xl
            px-6
            py-5
            shadow-sm
            flex
            items-center
            justify-between
          "
        >
          <div>
            <h3
              className="
                text-lg
                font-semibold
                text-darkText
              "
            >
              Videos subidos
            </h3>

            <p
              className="
                text-sm
                text-muted
                mt-1
              "
            >
              Has subido {videos.length} videos.
            </p>
          </div>

          <div
            className="
              w-14
              h-14
              rounded-2xl
              bg-blue-100
              flex
              items-center
              justify-center
            "
          >
            <Video
              size={24}
              className="
                text-primary
              "
            />
          </div>
        </div>
      )}

      {/* Empty */}
      {videos.length === 0 && (
        <div
          className="
            bg-white
            rounded-[32px]
            p-16
            text-center
            shadow-sm
          "
        >
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
              mb-6
            "
          >
            <Video
              size={42}
              className="
                text-slate-400
              "
            />
          </div>

          <h2
            className="
              text-2xl
              font-semibold
              text-darkText
              mb-3
            "
          >
            No has subido videos
          </h2>

          <p
            className="
              text-base
              text-muted
              max-w-md
              mx-auto
            "
          >
            Tus videos aparecerán aquí cuando subas contenido.
          </p>
        </div>
      )}

      {/* Grid */}
      {videos.length > 0 && (
        <div
          className="
           grid
           grid-cols-[repeat(auto-fill,minmax(340px,1fr))]
           gap-8
          "
        >
          {videos.map((video) => (
            <div key={video.id} className="relative">
              {/* Card */}
              <VideoCard video={video} isFavorite={false} />

              {/* Actions */}
              <div
                className="
                  absolute
                  top-4
                  left-4
                  flex
                  gap-2
                  z-20
                "
              >
                {/* Edit */}
                <button
                  onClick={() => handleEdit(video)}
                  className="
                    w-11
                    h-11
                    rounded-2xl
                    bg-white
                    shadow-md
                    flex
                    items-center
                    justify-center
                    hover:scale-105
                    transition
                  "
                >
                  <Pencil
                    size={18}
                    className="
                      text-primary
                    "
                  />
                </button>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(video.id)}
                  className="
                    w-11
                    h-11
                    rounded-2xl
                    bg-white
                    shadow-md
                    flex
                    items-center
                    justify-center
                    hover:scale-105
                    transition
                  "
                >
                  <Trash2
                    size={18}
                    className="
                      text-red-500
                    "
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <EditVideoModal
        video={selectedVideo}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onUpdated={fetchMyVideos}
      />
    </div>
  );
}

export default MyVideos;
