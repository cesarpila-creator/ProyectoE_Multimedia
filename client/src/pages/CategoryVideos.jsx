import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import { FolderOpen, Video } from "lucide-react";

import api from "../services/api";

import VideoCard from "../components/VideoCard";

function CategoryVideos() {
  const { id } = useParams();

  const [videos, setVideos] = useState([]);

  const [category, setCategory] = useState(null);

  const [loading, setLoading] = useState(true);

  // Load
  useEffect(() => {
    window.scrollTo(0, 0);

    fetchVideos();
  }, [id]);

  // Fetch
  const fetchVideos = async () => {
    try {
      const response = await api.get("/videos");

      const filtered = response.data.filter((video) => video.categoryId == id);

      setVideos(filtered);

      if (filtered.length > 0) {
        setCategory(filtered[0].Category);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
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
            "
          >
            Cargando categoría...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10">
      {/* HEADER */}
      <div
        className="
          flex
          flex-col
          lg:flex-row
          lg:items-center
          lg:justify-between
          gap-6
          mb-12
        "
      >
        {/* LEFT */}
        <div
          className="
            flex
            items-center
            gap-5
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
              shrink-0
            "
          >
            <FolderOpen
              size={30}
              className="
                text-primary
              "
            />
          </div>

          {/* Text */}
          <div>
            <h1
              className="
                text-4xl
                font-semibold
                text-darkText
                leading-tight
              "
            >
              {category?.name || "Categoría"}
            </h1>

            <p
              className="
                text-base
                text-muted
                mt-1
              "
            >
              Explora todos los videos disponibles en esta categoría.
            </p>
          </div>
        </div>

        {/* STATS */}
        <div
          className="
            bg-white
            rounded-3xl
            px-6
            py-5
            shadow-sm
            flex
            items-center
            gap-4
            min-w-[240px]
          "
        >
          <div
            className="
              w-12
              h-12
              rounded-2xl
              bg-blue-100
              flex
              items-center
              justify-center
            "
          >
            <Video
              size={22}
              className="
                text-primary
              "
            />
          </div>

          <div>
            <h3
              className="
                text-lg
                font-semibold
                text-darkText
              "
            >
              {videos.length}
            </h3>

            <p
              className="
                text-sm
                text-muted
              "
            >
              Videos disponibles
            </p>
          </div>
        </div>
      </div>

      {/* EMPTY */}
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
            <FolderOpen
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
            No hay videos
          </h2>

          <p
            className="
              text-base
              text-muted
              max-w-md
              mx-auto
            "
          >
            Esta categoría todavía no contiene videos.
          </p>
        </div>
      )}

      {/* VIDEOS */}
      {videos.length > 0 && (
        <div
          className="
            grid
            grid-cols-[repeat(auto-fill,minmax(340px,1fr))]
            gap-8
          "
        >
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}

export default CategoryVideos;
