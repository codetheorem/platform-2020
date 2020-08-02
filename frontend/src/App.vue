<template>
  <div id="app">
    <navbar :displayRouteList="displayRouteList"/>
    <router-view/>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import generalMixin from '@/mixins/general';
import Vue from 'vue';
import * as Sentry from '@sentry/browser';
import { Vue as VueIntegration } from '@sentry/integrations';

if (process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'test') {
  Sentry.init({
    dsn: 'https://cc58a94e8e7b4864aaa9f01242666f46@o414418.ingest.sentry.io/5320099',
    integrations: [new VueIntegration({ Vue, attachProps: true })],
  });
}

const routesWithoutNavBar = ['Login', 'Register', 'Authenticate'];

export default {
  name: 'App',
  components: {
    Navbar,
  },
  computed: {
    displayRouteList() {
      return !routesWithoutNavBar.includes(this.$route.name);
    },
  },
  async mounted() {
    while (!this.$route.name) {
      // eslint-disable-next-line no-await-in-loop
      await this.sleep(50);
    }
    this.verifyUserId();
  },
  mixins: [generalMixin],
  methods: {
    verifyUserId() {
      if ((!this.getUserId()) && ((this.$route.name !== 'Login' && this.$route.name !== 'authenticate'))) {
        this.$router.push('Login');
      }
    },
    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
  },
};
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
