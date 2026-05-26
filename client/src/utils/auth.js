const TOKEN_KEY = "token";

// SAVE
export const saveToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

// GET
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

// REMOVE
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};
