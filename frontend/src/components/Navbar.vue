<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light navigation-box sticky-top">
      <div class="logo-nav">
        <router-link to="/">
          <a class="navbar-brand" href="#">
            <img alt="Vue logo" src="../assets/technica-logo.svg" class="img-responsive" />
          </a>
        </router-link>
      </div>
      <span v-if="displayRouteList" class="mx-auto">
        <button
          class="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse mx-auto" id="navbarSupportedContent">
          <ul class="navbar-nav mx-auto">
            <span v-for="navRoute in navRoutes" :key="navRoute.name">
              <nav-item
                :title="navRoute.name"
                :destinationRoute="navRoute.path"
                :dropdown="navRoute.dropdown"
                :userIsMemberOfTeam="userIsMemberOfTeam"
              />
            </span>
          </ul>
        </div>
      </span>
    </nav>
</template>

<script>
import NavItem from '@/components/NavItem.vue';

export default {
  name: 'Navbar',
  components: {
    NavItem,
  },
  props: {
    displayRouteList: {
      type: Boolean,
      default: true,
    },
    userIsMemberOfTeam: Boolean,
  },
  data() {
    return {
      navRoutes: this.$router.options.routes.filter(
        (route) => route.displayInNavBar,
      ),
    };
  },
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.navigation-box {
  box-shadow: 0 4px 4px -5px rgba(0, 0, 0, 0.5);
}
</style>
