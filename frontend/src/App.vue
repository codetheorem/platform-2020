<template>
  <div id="app">
    <navbar :displayRouteList="displayRouteList"/>
    <router-view/>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import Vue from 'vue';
import * as Sentry from '@sentry/browser';
import { Vue as VueIntegration } from '@sentry/integrations';

Sentry.init({
  dsn: 'https://cc58a94e8e7b4864aaa9f01242666f46@o414418.ingest.sentry.io/5320099',
  integrations: [new VueIntegration({ Vue, attachProps: true })],
});

export default {
  name: 'App',
  components: {
    Navbar,
  },
  computed: {
    displayRouteList() {
      return this.$route.name !== 'Login';
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
