import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import { mask } from 'vue-the-mask';

// FontAwesome Configuration
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { 
  faMapMarkerAlt, 
  faCity, 
  faRoad, 
  faHashtag, 
  faPlus, 
  faMap,
  faWeight,
  faRulerVertical,
  faCalculator,
  faDumbbell,
  faSeedling,
  faChartLine,
  faFire,
  faTrophy,
  faUserMd,
  faPhone,
  faNotesMedical,
  faBullseye,
  faCalendarCheck,
  faFlag,
  faListCheck,
  faTimes,
  faCalendarDays,
  faClock,
  faCalendarWeek,
  faComment,
  faArrowLeft,
  faArrowRight,
  faCheck,
  faSpinner,
  faUserCheck,
  faHeartPulse,
  faHeart,
  faSmoking,
  faWineGlass,
  faBed,
  faBrain,
  faTriangleExclamation,
  faIdCard,
  faCalendarAlt,
  faUser,
  faCertificate,
  faStar,
  faUsers,
  faSearch,
  faUserSlash,
  faCheckCircle,
  faEnvelope
} from '@fortawesome/free-solid-svg-icons';

// Add icons to library
library.add(
  faMapMarkerAlt,
  faCity,
  faRoad,
  faHashtag,
  faPlus,
  faMap,
  faWeight,
  faRulerVertical,
  faCalculator,
  faDumbbell,
  faSeedling,
  faChartLine,
  faFire,
  faTrophy,
  faUserMd,
  faPhone,
  faNotesMedical,
  faBullseye,
  faCalendarCheck,
  faFlag,
  faListCheck,
  faTimes,
  faCalendarDays,
  faClock,
  faCalendarWeek,
  faComment,
  faArrowLeft,
  faArrowRight,
  faCheck,
  faSpinner,
  faUserCheck,
  faHeartPulse,
  faHeart,
  faSmoking,
  faWineGlass,
  faBed,
  faBrain,
  faTriangleExclamation,
  faIdCard,
  faCalendarAlt,
  faUser,
  faCertificate,
  faStar,
  faUsers,
  faSearch,
  faUserSlash,
  faCheckCircle,
  faEnvelope
);

const app = createApp(App);
const pinia = createPinia();

app.component('font-awesome-icon', FontAwesomeIcon);
app.use(router);
app.use(pinia);
app.directive('mask', mask);
app.mount('#app');