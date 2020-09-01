<template>
  <div class="page-container">
    <img src="@/assets/livestream.png" style="width: 100%; height: 100%;">
    <iframe id="live-stream-wrapper" src="https://www.youtube.com/embed/5jPwFWIvBzk" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
  </div>
</template>

<script>
import generalMixin from '../mixins/general';

export default {
  name: 'LiveStream',
  mixins: [generalMixin],
  methods: {
    goBack() {
      this.$router.push({ name: 'Home' });
    },
  },
};
</script>

<style scoped>
  .page-container {
    width: 100vw;
    height: 90vh;
  }
  #live-stream-wrapper {
    width: 30vw;
    height: 20vh;
  }
</style>
