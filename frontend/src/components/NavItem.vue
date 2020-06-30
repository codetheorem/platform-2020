<template>
  <li class="nav-item active">
    <router-link :to="destinationRoute">
        <a class="nav-link" href="#">{{ title }}</a>
    </router-link>
  </li>
</template>

<script>
export default {
  name: 'NavItem',
  props: {
      title: String,
      selectedRoute: String,
      destinationRoute: String
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .nav-link {
        color: #B6A1C4 !important;
        font-size: 18px;
        font-weight: 600;
    }

    @media (min-width: 992px) {
        .navbar-expand-lg .navbar-nav .nav-link {
            padding-right: 2.5rem;
            padding-left: 2.5rem;
        }
    }
</style>
