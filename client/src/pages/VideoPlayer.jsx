import toast from "react-hot-toast";

import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import { Heart, Share2, Eye, Calendar } from "lucide-react";

import api from "../services/api";

import VideoCard from "../components/VideoCard";

function VideoPlayer() {
  const { id } = useParams();

  const [video, setVideo] = useState(null);

  const [relatedVideos, setRelatedVideos] = useState([]);

  // LOAD
  useEffect(() => {
    window.scrollTo(0, 0);

    fetchVideo();

    fetchRelatedVideos();
  }, [id]);

  // CURRENT VIDEO
  const fetchVideo = async () => {
    try {
      const response = await api.get(`/videos/${id}`);

      setVideo(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // RELATED
  const fetchRelatedVideos = async () => {
    try {
      const response = await api.get("/videos");

      const filtered = response.data.filter((v) => v.id != id);

      setRelatedVideos(filtered);
    } catch (error) {
      console.log(error);
    }
  };

  // SHARE
  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/watch/${video.shareId}`;

    try {
      // MOBILE SHARE
      if (navigator.share) {
        await navigator.share({
          title: video.title,

          text: "Mira este video",

          url: shareUrl,
        });
      } else {
        // COPY LINK
        await navigator.clipboard.writeText(shareUrl);

        toast.success("🔗 Link copiado");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // LOADING
  if (!video) {
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
            Cargando video...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        grid
        grid-cols-1
        xl:grid-cols-[1fr_360px]
        gap-8
        items-start
      "
    >
      {/* LEFT */}
      <div>
        {/* PLAYER */}
        <div
          className="
            w-full
            aspect-video
            bg-black
            rounded-[30px]
            overflow-hidden
            shadow-2xl
            border
            border-slate-200
            flex
            items-center
            justify-center
          "
        >
          {/* PROCESSING */}
          {video.status === "processing" && (
            <div
              className="
                text-center
                px-6
              "
            >
              {/* SPINNER */}
              <div
                className="
                  w-20
                  h-20
                  border-4
                  border-white/20
                  border-t-white
                  rounded-full
                  animate-spin
                  mx-auto
                  mb-6
                "
              ></div>

              <h2
                className="
                  text-2xl
                  font-bold
                  text-white
                  mb-3
                "
              >
                Procesando video...
              </h2>

              <p
                className="
                  text-white/70
                  text-base
                  leading-relaxed
                  max-w-md
                  mx-auto
                "
              >
                Este video se está optimizando para reproducción web.
                <br />
                Esto puede tardar algunos minutos.
              </p>
            </div>
          )}

          {/* ERROR */}
          {video.status === "error" && (
            <div
              className="
                text-center
                px-6
              "
            >
              <div
                className="
                  text-6xl
                  mb-5
                "
              >
                ⚠️
              </div>

              <h2
                className="
                  text-2xl
                  font-bold
                  text-white
                  mb-3
                "
              >
                Error procesando video
              </h2>

              <p
                className="
                  text-white/70
                  text-base
                "
              >
                No fue posible convertir este archivo.
              </p>
            </div>
          )}

          {/* VIDEO */}
          {video.status === "processed" && (
            <video
              controls
              autoPlay
              key={video.id}
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
          )}
        </div>

        {/* CONTENT */}
        <div
          className="
            bg-white
            rounded-[30px]
            p-5
            sm:p-7
            shadow-sm
            mt-6
            border
            border-slate-100
          "
        >
          {/* CATEGORY */}
          <div
            className="
              inline-flex
              items-center
              px-4
              py-2
              rounded-full
              bg-blue-50
              text-primary
              text-xs
              font-semibold
              mb-5
            "
          >
            {video.Category?.name || "Videos"}
          </div>

          {/* TITLE */}
          <h1
            className="
              text-2xl
              sm:text-3xl
              lg:text-4xl
              font-bold
              text-darkText
              leading-tight
              mb-6
            "
          >
            {video.title}
          </h1>

          {/* META */}
          <div
            className="
              flex
              flex-col
              xl:flex-row
              xl:items-center
              xl:justify-between
              gap-6
              pb-7
              border-b
              border-slate-100
            "
          >
            {/* USER */}
            <div
              className="
                flex
                items-center
                gap-4
              "
            >
              {/* AVATAR */}
              <div
                className="
                  w-14
                  h-14
                  rounded-full
                  bg-primary
                  text-white
                  flex
                  items-center
                  justify-center
                  text-lg
                  font-bold
                  shrink-0
                "
              >
                {video.User?.username?.charAt(0)?.toUpperCase() || "U"}
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
                  {video.User?.username || "Usuario"}
                </h3>

                <div
                  className="
                    flex
                    flex-wrap
                    items-center
                    gap-4
                    text-sm
                    text-muted
                    mt-2
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-1.5
                    "
                  >
                    <Calendar size={15} />

                    {new Date(video.createdAt).toLocaleDateString()}
                  </div>

                  <div
                    className="
                      flex
                      items-center
                      gap-1.5
                    "
                  >
                    <Eye size={15} />
                    {video.views || 0} vistas
                  </div>
                </div>
              </div>
            </div>

            {/* ACTIONS */}
            <div
              className="
                flex
                flex-wrap
                items-center
                gap-3
              "
            >
              {/* FAVORITE */}
              <button
                className="
                  h-12
                  px-5
                  rounded-2xl
                  bg-background
                  hover:bg-red-50
                  transition-all
                  flex
                  items-center
                  gap-2
                  text-sm
                  font-semibold
                  border
                  border-slate-100
                "
              >
                <Heart size={18} />
                Favorito
              </button>

              {/* SHARE */}
              <button
                onClick={handleShare}
                className="
                  h-12
                  px-5
                  rounded-2xl
                  bg-background
                  hover:bg-blue-50
                  transition-all
                  flex
                  items-center
                  gap-2
                  text-sm
                  font-semibold
                  border
                  border-slate-100
                "
              >
                <Share2 size={18} />
                Compartir
              </button>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="pt-7">
            <h2
              className="
                text-xl
                font-semibold
                text-darkText
                mb-4
              "
            >
              Descripción
            </h2>

            <p
              className="
                text-[15px]
                sm:text-base
                text-muted
                leading-relaxed
                whitespace-pre-line
              "
            >
              {video.description || "Sin descripción"}
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div
        className="
          xl:sticky
          xl:top-[110px]
        "
      >
        <div
          className="
            flex
            items-center
            justify-between
            mb-6
          "
        >
          <h2
            className="
              text-2xl
              font-bold
              text-darkText
            "
          >
            Relacionados
          </h2>

          <span
            className="
              text-sm
              text-muted
            "
          >
            {relatedVideos.length} videos
          </span>
        </div>

        <div
          className="
            flex
            flex-col
            gap-5
          "
        >
          {relatedVideos.map((related) => (
            <VideoCard key={related.id} video={related} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default VideoPlayer;
