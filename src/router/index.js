import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/home.vue';
import LoginPage from '../views/login.vue';

const routes = [
  { path: '/', component: HomePage },
  { path: '/login', component: LoginPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
