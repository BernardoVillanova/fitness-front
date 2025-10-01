import { createRouter, createWebHistory } from 'vue-router';
import AboutUs from '../views/about.vue';
import HomePage from '../views/home.vue';
import LoginPage from '../views/login.vue';
import RegisterPage from '../views/register.vue';
import WorkoutPlans from '../views/workoutplans.vue';
import DashboardTech from '../views/dashboardtech.vue';
import  DashboardStudent from '@/views/dashboardstudent.vue';
import StudentList from '../components/StudentList.vue';
import StudentProfile from '../views/StudentProfile.vue'
import StudentRegister from '../views/studentregister.vue';
import InstructorRegister from '../views/instructorregister.vue';
import gymHome from '../views/gymHome.vue';
import NotFound from '../views/NotFound.vue';
import { useAuthStore } from '../store/auth';

const routes = [
  { path: '/', component: HomePage },
  { path: '/login', component: LoginPage },
  { path: '/register', component: RegisterPage },
  { path: '/students', component: StudentList },
  { path: '/gym', component: gymHome },
  {
    path: '/students/:id',
    component: StudentProfile,
    meta: { requiresAuth: true, role: 'personal' },
    props: true,
    // TO-DO Verificar lógica para validação de personal ao id do aluno
    // beforeEnter: async (to, from, next) => {
    //   const user = store.state.user // ou Pinia store.user
    //   const studentId = to.params.id

    //   // 1. Verifica se está logado e se é personal
    //   if (!user || user.role !== 'personal') {
    //     return next('/unauthorized')
    //   }

    //   try {
    //     // 2. Verifica se o aluno pertence a ele
    //     const isMyStudent = await api.checkIfStudentBelongsToPersonal(user.id, studentId)
    //     if (!isMyStudent) {
    //       return next('/unauthorized')
    //     }

    //     next()
    //   } catch (error) {
    //     console.error(error)
    //     next('/error')
    //   }
    // }
  },
  { path: '/about', component: AboutUs },
  { path: '/student-register', component: StudentRegister },
  { path: '/instructor-register', component: InstructorRegister },
  { path: '/exercises', component: () => import('../views/exercises.vue') },
  { path: '/workout-plans', component: WorkoutPlans },
  {
    path: '/dashboard',
    component: DashboardTech,
    // meta: { requiresAuth: true, role: 'personal' },  
  },
  {
    path: '/student-dashboard',
    component: DashboardStudent,
    // meta: { requiresAuth: true, role: 'student' },
  },
  // Student Routes
  {
    path: '/student/dashboard',
    component: DashboardStudent,
    // meta: { requiresAuth: true, role: 'student' },
  },
  {
    path: '/student/workouts',
    component: WorkoutPlans,
    // meta: { requiresAuth: true, role: 'student' },
  },
  {
    path: '/student/workout-session',
    component: () => import('../views/WorkoutSession.vue'),
    // meta: { requiresAuth: true, role: 'student' },
  },
  {
    path: '/student/progress',
    component: () => import('../views/StudentProgress.vue'),
    // meta: { requiresAuth: true, role: 'student' },
  },
  {
    path: '/student/history',
    component: () => import('../views/StudentHistory.vue'),
    // meta: { requiresAuth: true, role: 'student' },
  },
  {
    path: '/student/instructor',
    component: () => import('../views/StudentInstructor.vue'),
    // meta: { requiresAuth: true, role: 'student' },
  },
  {
    path: '/student/goals',
    component: () => import('../views/StudentGoals.vue'),
    // meta: { requiresAuth: true, role: 'student' },
  },
  {
    path: '/student/profile',
    component: () => import('../views/StudentProfile.vue'),
    // meta: { requiresAuth: true, role: 'student' },
  },
  {
    path: '/student/settings',
    component: () => import('../views/StudentSettings.vue'),
    // meta: { requiresAuth: true, role: 'student' },
  },
  // Catch all 404 - must be last
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
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