<template>
  <span>
    <li v-if="!dropdown" :id="'navbar-' + title" class="nav-item">
    <router-link :to="destinationRoute">
        <a class="nav-link" href="#">
          <span class="nav-inner-text">{{ title }}</span>
        </a>
    </router-link>
  </li>
  <li v-else :id="'navbar-' + title" class="nav-item dropdown">
    <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      {{ title }}
    </a>
    <div class="dropdown-menu" aria-labelledby="navbarDropdown">
      <span v-for="dropdownItem in visibleItemsInDropdown" :key="dropdownItem.name">
        <router-link :to="dropdownItem.path">
          <a :id="'navbar-item-' + dropdownItem.name.replace(/ /g,'')" class="dropdown-item" href="#">{{ dropdownItem.name }}</a>
        </router-link>
      </span>
    </div>
  </li>
  </span>
</template>

<script>
const routesThatRequireTeamMembership = ['/project', '/team-room'];

export default {
  name: 'NavItem',
  props: {
    title: String,
    destinationRoute: String,
    dropdown: {
      type: Array,
      default: null,
    },
    userIsMemberOfTeam: Boolean,
  },
  computed: {
    visibleItemsInDropdown() {
      if (this.userIsMemberOfTeam) {
        return this.dropdown;
      }
      return this.dropdown.filter((dropdownItem) => !routesThatRequireTeamMembership.includes(dropdownItem.path));
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .nav-inner-text, .nav-link.dropdown-toggle, .dropdown-menu, .dropdown-item{
      color: #B6A1C4 !important;
      font-size: 18px;
      font-weight: 600;
    }
    .nav-link{
      margin: 10px !important;
      padding: 10px !important;
    }
    .nav-inner-text, .nav-link.dropdown-toggle{
      padding: 10px !important;
    }
    .dropdown{
      padding-left: 10px;
    }
    .dropdown-menu{
      padding-left: 5px;
      padding-right: 15px;
      margin-left: 20px !important;
    }
    .dropdown-item{
      padding: 5px;
    }
    .nav-inner-text:hover, .nav-link.dropdown-toggle:hover, .dropdown-item:hover{
      color: #D66D50 !important;
      background: rgba(182, 161, 196, 0.25);
      border-radius: 4px;
    }
    @media (min-width: 992px) {
        .navbar-expand-lg .navbar-nav .nav-link {
            padding-right: 2.5rem;
            padding-left: 2.5rem;
        }
    }
</style>
