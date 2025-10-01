import { defineStore } from 'pinia';
import { jwtDecode } from 'jwt-decode';

// Mock data for demonstration purposes
const mockStudentData = {
  id: 'student_123',
  name: 'João Silva',
  email: 'joao.silva@email.com',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  personalInfo: {
    height: 175,
    weight: 78.5,
    age: 28,
    trainingExperience: 'intermediario',
    goals: ['Ganhar massa muscular', 'Melhorar resistência']
  },
  currentWorkout: {
    name: 'Treino A - Peito e Tríceps',
    exercises: [
      { id: 1, name: 'Supino Reto', sets: 4, reps: 12, weight: 80, completed: false },
      { id: 2, name: 'Supino Inclinado', sets: 3, reps: 10, weight: 70, completed: false },
      { id: 3, name: 'Crucifixo', sets: 3, reps: 15, weight: 25, completed: false },
      { id: 4, name: 'Tríceps Testa', sets: 3, reps: 12, weight: 40, completed: false }
    ]
  },
  stats: {
    totalWorkouts: 45,
    currentStreak: 5,
    weeklyGoal: 4,
    completedThisWeek: 2
  }
};

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: sessionStorage.getItem('token') || null,
    user: JSON.parse(sessionStorage.getItem('user') || 'null'),
    useMockData: true, // Flag para usar dados fictícios
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    userRole: (state) => {
      if (state.token) {
        try {
          const decodedToken = jwtDecode(state.token);
          return decodedToken.role || null;
        } catch (error) {
          console.error('Error decoding token:', error);
          return null;
        }
      }
      return null;
    },
    currentUser: (state) => {
      if (state.useMockData && state.userRole === 'student') {
        return mockStudentData;
      }
      return state.user;
    },
    isStudent: (state) => state.userRole === 'student',
    isInstructor: (state) => state.userRole === 'instructor' || state.userRole === 'personal',
  },
  actions: {
    setToken(token) {
      this.token = token;
      sessionStorage.setItem('token', token);
    },
    setUser(userData) {
      this.user = userData;
      sessionStorage.setItem('user', JSON.stringify(userData));
    },
    clearToken() {
      this.token = null;
      this.user = null;
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
    },
    logout() {
      this.clearToken();
    },
    toggleMockData() {
      this.useMockData = !this.useMockData;
    },
    updateUserData(data) {
      if (this.user) {
        this.user = { ...this.user, ...data };
        sessionStorage.setItem('user', JSON.stringify(this.user));
      }
    }
  },
});