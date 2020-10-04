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
    displayInNavBar: false,
  },
  {
    path: '/sponsor',
    name: 'Sponsorship Fair',
    component: () => import('../views/SponsorBooth.vue'),
    displayInNavBar: false,
  },
  {
    path: '/sponsor-analytics',
    name: 'Sponsor Booth Analytics',
    component: () => import('../views/SponsorAnalytics.vue'),
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
      window.open(Config.prod2.PRIZES_LINK, '_blank');
    },
  },
  {
    path: '/about',
    name: 'About',
    displayInNavBar: false,
    beforeEnter() {
      window.open(Config.prod2.ABOUT_LINK, '_blank');
    },
  },
  {
    path: '/profile',
    name: 'My Profile',
    component: () => import('../views/HackerProfile.vue'),
    displayInNavBar: false,
  },
  {
    path: '/resources',
    name: 'Hacker Resources',
    component: () => import('../views/HackerResources.vue'),
    displayInNavBar: false,
  },
  {
    path: '/games',
    name: 'Games',
    component: () => import('../views/Games.vue'),
    displayInNavBar: false,
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
    path: '/signup',
    name: 'Signup',
    component: () => import('../views/Signup.vue'),
    displayInNavBar: false,
  },
  {
    path: '/water-cooler',
    name: 'Water Cooler',
    component: () => import('../views/WaterCooler.vue'),
    displayInNavBar: false,
  },
  {
    path: '/slack',
    name: 'Slack',
    displayInNavBar: false,
    beforeEnter() {
      window.open(Config.prod2.SLACK_WORKSPACE_LINK, '_blank');
    },
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
    path: '/passport',
    name: 'Passport System',
    component: () => import('../views/Passport.vue'),
    displayInNavBar: false,
  },
  {
    path: '/faq',
    name: 'FAQ',
    component: () => import('../views/FAQ.vue'),
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
        path: '/about',
        name: 'About Hack the Mountains',
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
        path: '/slack',
        name: 'Slack',
      },
      {
        path: '/games',
        name: 'Games',
      },
      {
        path: '/water-cooler',
        name: 'Networking',
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
        name: 'Hacker Resources',
      },
      {
        path: '/faq',
        name: 'FAQ',
      },
    ],
  },
  {
    path: '/profile-dropdown',
    name: 'Profile',
    displayInNavBar: true,
    dropdown: [
      {
        path: '/passport',
        name: 'My Passport',
      },
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
    name: 'Authenticate',
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

router.beforeEach((to, from, next) => {
  if ((!Vue.cookie.get('userId')) && ((to.name !== 'Login' && to.name !== 'Authenticate' && to.name !== 'Signup'))) {
    next({ name: 'signup' });
  } else {
    next();
  }
});

export default router;
