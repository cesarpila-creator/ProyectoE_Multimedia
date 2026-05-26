import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import { ExternalLink } from "lucide-react";

import api from "../services/api";

function PublicVideo() {
  const { shareId } = useParams();

  const [video, setVideo] = useState(null);

  // LOAD
  useEffect(() => {
    fetchVideo();
  }, [shareId]);

  // FETCH VIDEO
  const fetchVideo = async () => {
    try {
      const response = await api.get(`/videos/share/${shareId}`);

      setVideo(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // LOADING
  if (!video) {
    return (
      <div
        className="
          h-screen
          bg-black
          flex
          items-center
          justify-center
          overflow-hidden
        "
      >
        <div className="text-center">
          <div
            className="
              w-16
              h-16
              border-4
              border-white
              border-t-transparent
              rounded-full
              animate-spin
              mx-auto
              mb-5
            "
          ></div>

          <p
            className="
              text-white/70
              text-lg
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
        h-screen
        bg-black
        text-white
        overflow-hidden
        flex
        flex-col
      "
    >
      {/* CONTENT */}
      <div
        className="
          flex-1
          flex
          flex-col
          items-center
          justify-center
          px-3
          py-3
          lg:px-6
          lg:py-5
        "
      >
        {/* WRAPPER */}
        <div
          className="
            w-full
            h-full
            max-w-[1400px]
            flex
            flex-col
            justify-center
            gap-4
          "
        >
          {/* VIDEO */}
          <div
            className="
              bg-black
              rounded-[22px]
              overflow-hidden
              shadow-2xl
              flex
              items-center
              justify-center
              h-[70vh]
              lg:h-[75vh]
            "
          >
            <video
              controls
              autoPlay
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
          </div>

          {/* INFO */}
          <div
            className="
              flex
              flex-col
              lg:flex-row
              lg:items-center
              lg:justify-between
              gap-4
              shrink-0
            "
          >
            {/* LEFT */}
            <div
              className="
                min-w-0
              "
            >
              <h1
                className="
                  text-lg
                  sm:text-2xl
                  lg:text-3xl
                  font-bold
                  truncate
                "
              >
                {video.title}
              </h1>

              <p
                className="
                  text-white/60
                  text-xs
                  sm:text-sm
                  lg:text-base
                  mt-2
                  line-clamp-2
                "
              >
                {video.description || "Sin descripción"}
              </p>
            </div>

            {/* BUTTON */}
            <a
              href={`/video/${video.id}`}
              className="
                h-12
                sm:h-14
                px-5
                sm:px-7
                rounded-2xl
                bg-primary
                hover:opacity-90
                transition-all
                inline-flex
                items-center
                justify-center
                gap-3
                font-semibold
                whitespace-nowrap
                shrink-0
                text-sm
                sm:text-base
              "
            >
              <ExternalLink size={18} />
              Ir al sitio web
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PublicVideo;
