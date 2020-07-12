<template>
  <span>
    <li v-if="!dropdown" class="nav-item">
    <router-link :to="destinationRoute">
        <a class="nav-link" href="#">{{ title }}</a>
    </router-link>
  </li>
  <li v-else class="nav-item dropdown">
    <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      {{ title }}
    </a>
    <div class="dropdown-menu" aria-labelledby="navbarDropdown">
      <span v-for="dropdownItem in dropdown" :key="dropdownItem.name">
        <router-link :to="dropdownItem.path">
          <a class="dropdown-item" href="#" >{{ dropdownItem.name }}</a>
        </router-link>
      </span>
    </div>
  </li>
  </span>
</template>

<script>
export default {
  name: 'NavItem',
  props: {
    title: String,
    destinationRoute: String,
    dropdown: {
      type: Array,
      default: null,
    },
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
