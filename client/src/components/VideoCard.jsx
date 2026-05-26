import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { Heart, Play } from "lucide-react";

import toast from "react-hot-toast";

import formatDuration from "../utils/formatDuration";

import { toggleFavorite } from "../services/favorite.service";

function VideoCard({
  video,
  isFavorite,
  onFavoriteUpdate,
  showFavorite = false,
}) {
  const navigate = useNavigate();

  const [hovered, setHovered] = useState(false);

  const [favorite, setFavorite] = useState(isFavorite);

  // Sync favorites
  useEffect(() => {
    setFavorite(isFavorite);
  }, [isFavorite]);

  // Favorite handler
  const handleFavorite = async (e) => {
    e.stopPropagation();

    try {
      await toggleFavorite(video.id);

      const newValue = !favorite;

      setFavorite(newValue);

      if (onFavoriteUpdate) {
        onFavoriteUpdate();
      }

      if (newValue) {
        toast.success("❤️ Agregado a favoritos");
      } else {
        toast("💔 Eliminado de favoritos");
      }
    } catch (error) {
      console.log(error);

      toast.error("Error actualizando favorito");
    }
  };

  return (
    <div
      onClick={() => navigate(`/video/${video.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="
        group
        bg-white
        rounded-[28px]
        overflow-hidden
        shadow-sm
        hover:shadow-2xl
        hover:-translate-y-1
        transition-all
        duration-300
        cursor-pointer
        border
        border-slate-100
      "
    >
      {/* THUMBNAIL */}
      <div
        className="
          relative
          aspect-video
          bg-black
          overflow-hidden
        "
      >
        {/* PREVIEW */}
        {hovered ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="
              w-full
              h-full
              object-contain
              bg-black
            "
          >
            <source
              src={`{video.filename}`}
              type="video/mp4"
            />
          </video>
        ) : (
          <img
            src={
              video.thumbnail
                ? video.thumbnail
                : "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4"
            }
            alt={video.title}
            className="
              w-full
              h-full
              object-contain
              bg-black
              group-hover:scale-[1.02]
              transition-transform
              duration-300
            "
          />
        )}

        {/* Overlay */}
        <div
          className="
          absolute
          inset-0
          bg-gradient-to-t
        from-black/50
          via-transparent
          to-transparent
          z-10
          "
        ></div>

        {/* PLAY ICON */}
        <div
          className="
            absolute
            inset-0
            flex
            items-center
            justify-center
            opacity-0
            group-hover:opacity-100
            transition
            duration-300
          "
        >
          <div
            className="
              w-16
              h-16
              rounded-full
              bg-white/20
              backdrop-blur-md
              flex
              items-center
              justify-center
            "
          >
            <Play
              size={30}
              className="
                text-white
                fill-white
                ml-1
              "
            />
          </div>
        </div>

        {/* FAVORITE */}
        {showFavorite && (
          <button
            onClick={handleFavorite}
            className="
            absolute
            top-4
            right-4
            w-12
            h-12
            rounded-full
          bg-white
            border
          border-slate-200
            shadow-xl
            flex
            items-center
            justify-center
            z-[999]
            hover:scale-110
            transition-all
            duration-200
            "
          >
            <Heart
              size={20}
              className={
                favorite ? "fill-red-500 text-red-500" : "text-slate-500"
              }
            />
          </button>
        )}

        {/* DURATION */}
        <div
          className="
            absolute
            bottom-4
            right-4
            bg-black/80
            backdrop-blur-sm
            text-white
            px-3
            py-1.5
            rounded-xl
            text-xs
            font-semibold
            z-10
          "
        >
          {formatDuration(video.duration)}
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-5">
        {/* CATEGORY */}
        <div
          className="
            inline-flex
            items-center
            bg-blue-50
            text-primary
            px-3
            py-1.5
            rounded-full
            text-[11px]
            font-semibold
            mb-4
          "
        >
          {video.Category?.name || "Videos"}
        </div>

        {/* TITLE */}
        <h2
          className="
            text-lg
            font-semibold
            text-darkText
            leading-snug
            line-clamp-2
            mb-4
            min-h-[56px]
          "
        >
          {video.title}
        </h2>

        {/* FOOTER */}
        <div
          className="
            flex
            items-center
            justify-between
            text-sm
            text-muted
          "
        >
          <div
            className="
              flex
              items-center
              gap-2
            "
          >
            {/* Avatar */}
            <div
              className="
                w-8
                h-8
                rounded-full
                bg-primary
                text-white
                flex
                items-center
                justify-center
                text-xs
                font-semibold
              "
            >
              {video.User?.username?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <span
              className="
                font-medium
                truncate
                max-w-[120px]
              "
            >
              {video.User?.username || "Usuario"}
            </span>
          </div>

          <span
            className="
              text-xs
            "
          >
            {new Date(video.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}

export default VideoCard;
