import axios from "axios";
import { API_BASE_URL } from "./config";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response && error.response.status === 401) {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
    }
    
    return Promise.reject(error);
  }
);

// API de Academias
export const getAllGyms = () => api.get("/gyms");
export const getGymById = (id) => api.get(`/gyms/${id}`);
export const createGym = (gymData) => api.post("/gyms", gymData);
export const updateGym = (id, gymData) => api.put(`/gyms/${id}`, gymData);
export const deleteGym = (id) => api.delete(`/gyms/${id}`);

// Gerenciamento de Alunos nas Academias
export const addStudentToGym = (gymId, studentData) => api.post(`/gyms/${gymId}/students`, studentData);
export const removeStudentFromGym = (gymId, studentId) => api.delete(`/gyms/${gymId}/students/${studentId}`);
export const getGymStudents = (gymId) => api.get(`/gyms/${gymId}/students`);

// API de Alunos
export const getStudents = (params = {}) => api.get("/students", { params });
export const getStudentById = (id) => api.get(`/students/${id}`);
export const createStudent = (studentData) => api.post("/students", studentData);
export const updateStudent = (id, studentData) => api.put(`/students/${id}`, studentData);
export const deleteStudent = (id) => api.delete(`/students/${id}`);
export const unassignInstructor = (studentId) => api.delete(`/students/${studentId}/instructor`);
export const addStudentProgress = (studentId, progressData) => api.post(`/students/${studentId}/progress`, progressData);

// API de Planos de Treino
export const getWorkoutPlans = () => api.get("/workout/workout-plans");
export const assignPlanToStudent = (studentId, planId) => api.put(`/students/${studentId}`, { workoutPlans: [planId] });

// API de Instrutores
export const getStudentsByInstructor = (instructorId) => api.get(`/students/instructor/${instructorId}`);

// API de Sessões de Treino
export const getWorkoutSessions = () => api.get("/workout-sessions/sessions/all");
export const getSessionHistory = () => api.get("/workout-sessions/sessions/history");
export const getInstructorSessions = (instructorId) => {
  if (instructorId) {
    return api.get(`/workout-sessions/sessions/instructor/${instructorId}`);
  } else {
    // Se não tem instructorId, chama sem parâmetro (usa o userId do token)
    return api.get('/workout-sessions/sessions/instructor');
  }
};
export const unlinkStudent = (studentId) => api.put(`/students/${studentId}/unlink`);

export default api;