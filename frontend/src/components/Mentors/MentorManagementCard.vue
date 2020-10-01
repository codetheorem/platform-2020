<template>
  <div class="banner-wrapper">

      <div class="banner-body">
        <div class="technica-logo-icon"></div>
        <span class="banner-text">{{requestDescription}}</span>
      </div>

      <div style="text-align:right !important">
        <a class="banner-action" v-b-modal.request-view-modal @click="view">View</a>
        <a class="banner-action">Claim</a>
      </div>

  </div>
</template>

<script>

export default {
  name: 'MentorManagementCard',
  components: {
  },
  props: {
    requestDescription: String,
  },
  methods: {
    view() {
      this.$emit('viewCard', { title: this.requestDescription });
    },
  },

};
</script>

<style scoped>

  .banner-wrapper {
    background: #FFFFFF;
    border-radius: 8px;
    filter: drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.25));
    padding: 5px;
    padding-bottom: 10px;
    margin: .5rem;
    font-family: 'Noto Sans';
  }

  .banner-body {
    display: flex;
    justify-content: left;
    align-content: center;
    text-align: left;
  }

  .technica-logo-icon {
    background: linear-gradient(179.71deg, #23D8D8 -15.87%, #FF639D 99.75%);
    transform: matrix(-0.01, -1, 1, -0.01, 0, 0);
    width: 2rem;
    height: 2rem;
    border-radius: 2rem;
    margin-left: .75rem;
    margin-right: .75rem;
    margin-top: .75rem;
  }

  .banner-text {
    margin-left: 1rem;
    margin-right: 1rem;
    margin-top: .25rem;
  }

  .banner-action {
    margin-left: 1rem;
    margin-right: 1rem;
    color: #CA484F !important;
    font-weight: bold;
  }

  .banner-action:hover {
    color: #D66D50 !important;
    cursor: pointer;
  }

</style>
