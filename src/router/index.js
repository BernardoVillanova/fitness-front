import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/home.vue';
import LoginPage from '../views/login.vue';
import RegisterPage from '../views/register.vue';
import DashboardTech from '../views/dashboardtech.vue';
import StudentList from '../components/StudentList.vue'
import AboutUs from '../views/about.vue'
import StudentRegister from '../views/studentregister.vue';
import { useAuthStore } from '../store/auth';

const routes = [
  { path: '/', component: HomePage },
  { path: '/login', component: LoginPage },
  { path: '/register', component: RegisterPage },
  { path: '/students', component: StudentList },
  { path: '/about', component: AboutUs},
  { path: '/student-register', component: StudentRegister},
  {
    path: '/dashboard',
    component: DashboardTech,
    // meta: { requiresAuth: true, role: 'personal' },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      return next('/login');
    }

    if (to.meta.role && to.meta.role !== authStore.userRole) {
      return next('/');
    }
  }

  next();
});

export default router;