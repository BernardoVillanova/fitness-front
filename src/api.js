import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

// Configura interceptors para logging
api.interceptors.request.use(request => {
  console.log('API Request:', request);
  return request;
});

api.interceptors.response.use(
  response => {
    console.log('API Response:', response);
    return response;
  },
  error => {
    console.error('API Error:', error.response);
    return Promise.reject(error);
  }
);

// Gym related API calls
export const getAllGyms = () => {
  return api.get("/gyms");
};

export const getGymById = (id) => {
  return api.get(`/gyms/${id}`);
};

export const createGym = (gymData) => {
  return api.post("/gyms", gymData, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export const updateGym = (id, gymData) => {
  return api.put(`/gyms/${id}`, gymData, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export const deleteGym = (id) => {
  return api.delete(`/gyms/${id}`);
};

export default api;