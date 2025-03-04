import { defineStore } from 'pinia';
import { jwtDecode } from 'jwt-decode';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: sessionStorage.getItem('token') || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    userRole: (state) => {
      if (state.token) {
        const decodedToken = jwtDecode(state.token);
        console.log('decodedToken: ', decodedToken);
        return decodedToken.role || null;
      }
      return null;
    },
  },
  actions: {
    setToken(token) {
      this.token = token;
      sessionStorage.setItem('token', token);
    },
    clearToken() {
      this.token = null;
      sessionStorage.removeItem('token');
    },
  },
});