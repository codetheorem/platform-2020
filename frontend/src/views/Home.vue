<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/technica-logo.png" height="150" width="700">
    <HelloWorld msg="Welcome to Technica's Virtual Platform!"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue';

export default {
  name: 'Home',
  components: {
    HelloWorld,
  },
};
</script>
