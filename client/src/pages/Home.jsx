import { useEffect, useState } from "react";

import { Video, Flame } from "lucide-react";

import VideoCard from "../components/VideoCard";

import api from "../services/api";

import { getFavorites } from "../services/favorite.service";

import { useSearch } from "../context/SearchContext";

function Home() {
  const [videos, setVideos] = useState([]);

  const [favorites, setFavorites] = useState([]);

  const [loading, setLoading] = useState(true);

  const { search } = useSearch();

  // LOAD DATA
  useEffect(() => {
    fetchVideos();

    loadFavorites();
  }, []);

  // FETCH VIDEOS
  const fetchVideos = async () => {
    try {
      const response = await api.get("/videos");

      setVideos(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // FAVORITES
  const loadFavorites = async () => {
    try {
      const data = await getFavorites();

      const ids = data.map((fav) => fav.Video?.id || fav.id);

      setFavorites(ids);
    } catch (error) {
      console.log(error);
    }
  };

  // FILTER
  const filteredVideos = videos.filter((video) =>
    video.title?.toLowerCase().includes(search.toLowerCase()),
  );

  // LOADING
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
    <div
      className="
        w-full
        max-w-[1800px]
        mx-auto
      "
    >
      {/* HEADER */}
      <div
        className="
          flex
          flex-col
          xl:flex-row
          xl:items-center
          xl:justify-between
          gap-6
          mb-10
        "
      >
        {/* LEFT */}
        <div
          className="
            flex
            items-center
            gap-4
          "
        >
          {/* ICON */}
          <div
            className="
              w-14
              h-14
              sm:w-16
              sm:h-16
              rounded-2xl
              bg-blue-100
              flex
              items-center
              justify-center
              shrink-0
            "
          >
            <Video
              size={28}
              className="
                text-primary
              "
            />
          </div>

          {/* TEXT */}
          <div>
            <h1
              className="
                text-2xl
                sm:text-3xl
                lg:text-4xl
                font-bold
                text-darkText
                leading-tight
              "
            >
              Biblioteca Multimedia
            </h1>

            <p
              className="
                text-sm
                sm:text-base
                text-muted
                mt-1
              "
            >
              Explora todos los videos disponibles.
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div
          className="
            bg-white
            rounded-3xl
            px-5
            py-4
            shadow-sm
            flex
            items-center
            gap-4
            w-full
            sm:w-auto
            sm:min-w-[250px]
            border
            border-slate-100
          "
        >
          {/* ICON */}
          <div
            className="
              w-12
              h-12
              rounded-2xl
              bg-orange-100
              flex
              items-center
              justify-center
              shrink-0
            "
          >
            <Flame
              size={22}
              className="
                text-orange-500
              "
            />
          </div>

          {/* INFO */}
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
      {filteredVideos.length === 0 && (
        <div
          className="
            bg-white
            rounded-[32px]
            p-10
            sm:p-16
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
            No se encontraron videos
          </h2>

          <p
            className="
              text-base
              text-muted
              max-w-md
              mx-auto
            "
          >
            Intenta buscar otro título o revisa más tarde.
          </p>
        </div>
      )}

      {/* GRID */}
      {filteredVideos.length > 0 && (
        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            2xl:grid-cols-3
            gap-6
            lg:gap-8
          "
        >
          {filteredVideos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              isFavorite={favorites.includes(video.id)}
              onFavoriteUpdate={loadFavorites}
              showFavorite={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
