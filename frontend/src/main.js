import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

// Importing the global css file
import './assets/global.css'

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
