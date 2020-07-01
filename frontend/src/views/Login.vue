<template>
  <div class="login-container">
    <h1>This is a login page</h1>
    <Button size="lg" text="Hugo is cool"/>
  </div>
</template>

<script>
import Button from '@/components/Button.vue';

export default {
  name: 'Login',
  components: {
    Button
  }
};
</script>


<style>
  #app {
    background-image: radial-gradient(#ffafbd, #ffc3a0);
    width: 100vw;
    height: 100vh;
  }
</style>
