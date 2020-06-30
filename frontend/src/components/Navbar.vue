<template>
  <div>
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="logo-nav">
            <a class="navbar-brand" href="#">
                <img alt="Vue logo" src="../assets/technica-logo.svg" class="img-responsive">
            </a>
        </div>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto">
                <span v-for="navRoute in navRoutes" :key="navRoute">
                    <nav-item :title="navRoute" :selectedRoute="selectedRoute"/>
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
          navRoutes: this.$router.options.routes.filter(route => route.displayInNavBar).map(route => route.name),
          selectedRoute: "Home"
      }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
