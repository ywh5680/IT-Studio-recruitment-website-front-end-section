import { createRouter, createWebHistory } from 'vue-router';
import HeroAnimation from '../components/HeroAnimation.vue';
import AboutUsView from '../views/AboutUs.vue';
import DepartmentsView from '../views/Departments.vue';
import ProjectsView from '../views/Projects.vue';
import TeamView from '../views/Team.vue';
import MessageBoardView from '../views/MessageBoard.vue';
import StatusView from '../views/Status.vue';
import RegistrationView from '../views/Registration.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HeroAnimation,
  },
  {
    path: '/about-us',
    name: 'AboutUs',
    component: AboutUsView,
  },
  {
    path: '/departments',
    name: 'Departments',
    component: DepartmentsView,
  },
  {
    path: '/projects',
    name: 'Projects',
    component: ProjectsView,
  },
  {
    path: '/team',
    name: 'Team',
    component: TeamView,
  },
  {
    path: '/message-board',
    name: 'MessageBoard',
    component: MessageBoardView,
  },
  {
    path: '/application-status',
    name: 'ApplicationStatus',
    component: StatusView,
  },
  {
    path: '/registration',
    name: 'Registration',
    component: RegistrationView,
  },
  // We will add more routes here for each section
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router; 