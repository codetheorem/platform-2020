import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Config from '../config/general';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    displayInNavBar: true,
  },
  {
    path: '/sponsors',
    name: 'Sponsors',
    component: () => import('../views/Sponsors.vue'),
    displayInNavBar: true,
  },
  {
    path: '/sponsorship-fair',
    name: 'Sponsorship Fair',
    component: () => import('../views/SponsorshipFair.vue'),
    displayInNavBar: false,
  },
  {
    path: '/live-stream',
    name: 'Live Stream',
    component: () => import('../views/LiveStream.vue'),
    displayInNavBar: true,
    beforeEnter() {
      window.open(Config.dev.LIVESTREAM_LINK, '_blank');
    },
  },
  {
    path: '/schedule',
    name: 'Schedule',
    component: () => import('../views/Schedule.vue'),
    displayInNavBar: true,
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    displayInNavBar: false,
  },
  {
    path: '/project',
    name: 'Project',
    component: () => import('../views/Project.vue'),
    displayInNavBar: true,
  },
  {
    path: '/team',
    name: 'Team',
    component: () => import('../views/Team.vue'),
    displayInNavBar: true,
  },
  {
    path: '/team-room',
    name: 'Team Room',
    component: () => import('../views/TeamRoom.vue'),
    displayInNavBar: true,
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    displayInNavBar: false,
  },
  {
    path: '/help',
    name: 'Help',
    component: () => import('../views/HelpDesk.vue'),
    displayInNavBar: true,
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/Profile.vue'),
    displayInNavBar: true,
    dropdown: [
      {
        path: '/logout',
        name: 'Sign Out',
      },
    ],
  },
  {
    path: '/404',
    name: '404',
    component: () => import('../views/404.vue'),
    displayInNavBar: false,
  },
  {
    path: '/authenticate',
    component: () => import('../views/Authenticate.vue'),
    displayInNavBar: false,
  },
  {
    path: '/logout',
    component: () => import('../views/Logout.vue'),
    displayInNavBar: false,
  },
  {
    path: '/:shortlink',
    component: () => import('../views/ShortLink.vue'),
    displayInNavBar: false,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
