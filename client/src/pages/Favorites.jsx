import { useEffect, useState } from "react";

import { Heart, BookmarkX } from "lucide-react";

import VideoCard from "../components/VideoCard";

import { getFavorites } from "../services/favorite.service";

function Favorites() {
  const [videos, setVideos] = useState([]);

  const [loading, setLoading] = useState(true);

  // Load favorites
  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const data = await getFavorites();

      const formattedVideos = data.map((fav) => fav.Video || fav);

      setVideos(formattedVideos);
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
              font-medium
            "
          >
            Cargando favoritos...
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
            bg-red-100
            flex
            items-center
            justify-center
          "
        >
          <Heart
            size={30}
            className="
              text-red-500
              fill-red-500
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
            Mis Favoritos
          </h1>

          <p
            className="
              text-base
              text-muted
              mt-1
            "
          >
            Tus videos guardados y favoritos.
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
              Videos favoritos
            </h3>

            <p
              className="
                text-sm
                text-muted
                mt-1
              "
            >
              Has guardado {videos.length} videos.
            </p>
          </div>

          <div
            className="
              w-14
              h-14
              rounded-2xl
              bg-red-100
              flex
              items-center
              justify-center
            "
          >
            <Heart
              size={24}
              className="
                text-red-500
                fill-red-500
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
            <BookmarkX size={42} className="text-slate-400" />
          </div>

          <h2
            className="
              text-2xl
              font-semibold
              text-darkText
              mb-3
            "
          >
            No tienes favoritos
          </h2>

          <p
            className="
              text-base
              text-muted
              max-w-md
              mx-auto
            "
          >
            Guarda videos en favoritos para acceder rápidamente a ellos más
            tarde.
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
            <VideoCard
              key={video.id}
              video={video}
              isFavorite={true}
              onFavoriteUpdate={loadFavorites}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;
