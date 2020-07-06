<template>
  <div class="home mx-auto">
    <img alt="Vue logo" src="../assets/technica-logo.svg" width="584" height="120">
    <HelloWorld msg="Welcome to Technica's Virtual Platform!"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue';
import Button from '@/components/Button.vue';

export default {
  name: 'Home',
  components: {
    HelloWorld,
    Button
  },
};
</script>

<style scoped>
.home {
  margin-top: 4rem;
}
</style>
