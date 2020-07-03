import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { BootstrapVue } from 'bootstrap-vue'

Vue.config.productionTip = false;

// Importing the global css file
import './assets/global.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

const VueCookie = require('vue-cookie');
// Tell Vue to use the plugin
Vue.use(VueCookie);
Vue.use(BootstrapVue)

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
