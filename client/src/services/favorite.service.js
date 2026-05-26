import api from "./api";

export const toggleFavorite = async (videoId) => {
  const response = await api.post(`/favorites/${videoId}`);

  return response.data;
};

export const getFavorites = async () => {
  const response = await api.get("/favorites");

  return response.data;
};
