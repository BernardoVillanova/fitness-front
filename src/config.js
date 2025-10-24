export const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:3000';
export const API_BASE_URL = `${API_URL}/api`;

export const getImageUrl = (path) => {
  if (!path) return '';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_URL}${cleanPath}`;
};
