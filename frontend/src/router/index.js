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
    displayInNavBar: false,
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
    displayInNavBar: false,
  },
  {
    path: '/prizes',
    name: 'Prizes',
    displayInNavBar: false,
    beforeEnter() {
      window.open(Config.dev.PRIZES_LINK, '_blank');
    },
  },
  {
    path: '/resources',
    name: 'Helpful Resources',
    displayInNavBar: false,
    beforeEnter() {
      window.open(Config.dev.HACKER_RESOURCES_LINK, '_blank');
    },
  },
  {
    path: '/schedule',
    name: 'Schedule',
    component: () => import('../views/Schedule.vue'),
    displayInNavBar: false,
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
    displayInNavBar: false,
  },
  {
    path: '/team',
    name: 'Team',
    component: () => import('../views/Team.vue'),
    displayInNavBar: false,
  },
  {
    path: '/team-room',
    name: 'Team Room',
    component: () => import('../views/TeamRoom.vue'),
    displayInNavBar: false,
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    displayInNavBar: false,
  },
  {
    path: '/mentorship-requests',
    name: 'Mentorship Requests',
    component: () => import('../views/MentorshipRequests.vue'),
    displayInNavBar: false,
  },
  {
    path: '/help',
    name: 'Help',
    component: () => import('../views/HelpDesk.vue'),
    displayInNavBar: false,
  },
  {
    path: '/water-cooler',
    name: 'Water Cooler',
    component: () => import('../views/WaterCooler.vue'),
    displayInNavBar: false,
  },
  {
    path: '/photo-booth',
    name: 'Photo Booth',
    component: () => import('../views/PhotoBooth.vue'),
    displayInNavBar: false,
  },
  {
    path: '/request-mentor',
    name: 'Request A Mentor',
    component: () => import('../views/RequestMentor.vue'),
    displayInNavBar: false,
  },
  {
    path: '/events',
    name: 'Events',
    displayInNavBar: true,
    dropdown: [
      {
        path: '/schedule',
        name: 'Schedule',
      },
      {
        path: '/live-stream',
        name: 'Live Stream',
      },
      {
        path: '/sponsors',
        name: 'Sponsors',
      },
    ],
  },
  {
    path: '/hack',
    name: 'Hack',
    displayInNavBar: true,
    dropdown: [
      {
        path: '/team',
        name: 'My Team',
      },
      {
        path: '/team-room',
        name: 'Team Room',
      },
      {
        path: '/project',
        name: 'Submit Project',
      },
      {
        path: '/request-mentor',
        name: 'Request A Mentor',
      },
      {
        path: '/prizes',
        name: 'Prizes',
      },
    ],
  },
  {
    path: '/social',
    name: 'Social',
    displayInNavBar: true,
    dropdown: [
      {
        path: '/water-cooler',
        name: 'Water Cooler',
      },
      {
        path: '/photo-booth',
        name: 'Photo Booth',
      },
    ],
  },
  {
    path: '/resources',
    name: 'Resources',
    displayInNavBar: true,
    dropdown: [
      {
        path: '/help',
        name: 'Help Desk',
      },
      {
        path: '/resources',
        name: 'Helpful Resources',
      },
    ],
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
