import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

// Adiciona o token JWT em todas as requisições
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
    console.log('[API DEBUG] Resposta bem-sucedida:', {
      url: response.config.url,
      method: response.config.method,
      status: response.status,
      data: response.data
    });
    return response;
  },
  error => {
    console.error('[API ERROR] Erro na requisição:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    
    // Se receber 401, pode limpar o token e redirecionar para login
    if (error.response && error.response.status === 401) {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      // Opcional: redirecionar para login
      // window.location.href = '/login';
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