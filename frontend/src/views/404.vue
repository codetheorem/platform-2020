<template>
  <div class="about">
    <h1 class="error">404</h1>
    <h1 class="sorry">Sorry! We can't find the page you were looking for.</h1>
    <Button text="Back to Homepage" @click="goBack" />
  </div>
</template>

<script>
import Button from "@/components/Button.vue";
export default {
  name: "404",
  components: {
    Button,
  },
  methods: {
    goBack() {
      this.$router.push({ name: "Home" });
    },
  },
};
</script>

<style scoped>
.about {
  background: #f6f4f7;
  text-align: left;
  padding: 10.2rem;
  padding-top: 5.3rem;
  height: 100vh;
}
.error {
  font-size: 7.1rem;
  font-weight: 600;
  color: #23d8d8;
}
.sorry {
  font-size: 4.75rem;
  padding-top: 0.9rem;
  font-weight: 600;
  padding-bottom: 3.25rem;
  line-height: 100%;
  background: linear-gradient(
    to bottom right,
    #23d8d8 5.87%,
    #b6a1c4 40.41%,
    #ff639d 64.94%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
html {
  background: #f6f4f7;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
}
</style>
