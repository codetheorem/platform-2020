<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/sponsorship-fair">Sponsorship Fair</router-link> |
      <router-link to="/live-stream">Live Stream</router-link> |
      <router-link to="/schedule" class="schedule">Schedule</router-link> |
      <router-link to="/profile" class="profile">Profile</router-link> |
      <router-link to="/login">Login</router-link> |
      <router-link to="/register">Register</router-link> |
    </div> -->
    <navbar />
    <router-view/>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
export default {
  name: 'App',
  components: {
    Navbar
  }
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
