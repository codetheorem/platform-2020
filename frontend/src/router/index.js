import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    displayInNavBar: true
  },
  {
    path: '/sponsors',
    name: 'Sponsors',
    component: () => import('../views/Sponsors.vue'),
    displayInNavBar: true
  },
  {
    path: '/sponsorship-fair',
    name: 'Sponsorship Fair',
    component: () => import('../views/SponsorshipFair.vue'),
    displayInNavBar: true
  },
  {
    path: '/live-stream',
    name: 'Live Stream',
    component: () => import('../views/LiveStream.vue'),
    displayInNavBar: true
  },
  {
    path: '/schedule',
    name: 'Schedule',
    component: () => import('../views/Schedule.vue'),
    displayInNavBar: true
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
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    displayInNavBar: true
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    displayInNavBar: true
  },
  {
    path: '/404',
    name: '404',
    component: () => import('../views/404.vue'),
    displayInNavBar: false
  },
  {
    path: '/authenticate', 
    component: () => import('../views/Authenticate.vue'),
    displayInNavBar: false
  },
  {
    path: '/logout', 
    component: () => import('../views/Logout.vue'),
    displayInNavBar: false
  },
  {
    path: '/:shortlink', 
    component: () => import('../views/ShortLink.vue'),
    displayInNavBar: false
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
