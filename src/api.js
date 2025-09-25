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

// API de Academias
export const getAllGyms = () => api.get("/gyms");
export const getGymById = (id) => api.get(`/gyms/${id}`);
export const createGym = (gymData) => api.post("/gyms", gymData);
export const updateGym = (id, gymData) => api.put(`/gyms/${id}`, gymData);
export const deleteGym = (id) => api.delete(`/gyms/${id}`);

// API de Alunos
export const getStudents = (params = {}) => api.get("/students", { params });
export const getStudentById = (id) => api.get(`/students/${id}`);
export const createStudent = (studentData) => api.post("/students", studentData);
export const updateStudent = (id, studentData) => api.put(`/students/${id}`, studentData);
export const deleteStudent = (id) => api.delete(`/students/${id}`);
export const unassignInstructor = (studentId) => api.delete(`/students/${studentId}/instructor`);
export const addStudentProgress = (studentId, progressData) => api.post(`/students/${studentId}/progress`, progressData);

export default api;