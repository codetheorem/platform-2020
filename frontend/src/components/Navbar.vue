<template>
  <div>
      <nav class="navbar navbar-expand-lg navbar-light bg-light navigation-box">
        <div class="logo-nav">
            <a class="navbar-brand" href="#">
                <img alt="Vue logo" src="../assets/technica-logo.svg" class="img-responsive">
            </a>
        </div>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse mx-auto" id="navbarSupportedContent">
            <ul class="navbar-nav mx-auto">
                <span v-for="navRoute in navRoutes" :key="navRoute.name">
                    <nav-item :title="navRoute.name" :selectedRoute="selectedRoute" :destinationRoute="navRoute.path"/>
                </span>
            </ul>
        </div>
    </nav>
  </div>
</template>

<script>
import NavItem from '@/components/NavItem.vue';

export default {
  name: 'Navbar',
  components: {
      NavItem
  },
  props: {

  },
  data(){
      return {
          navRoutes: this.$router.options.routes.filter(route => route.displayInNavBar),
          selectedRoute: "Home"
      }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .navigation-box {
        box-shadow: 0 4px 4px -5px rgba(0,0,0,.5);
        margin-bottom: 2rem;
    }
</style>
