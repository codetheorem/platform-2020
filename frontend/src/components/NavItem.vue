<template>
  <li class="nav-item active">
    <a class="nav-link" href="#">{{ title }}</a>
  </li>
</template>

<script>
export default {
  name: 'NavItem',
  props: {
      title: String,
      selectedRoute: String
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
