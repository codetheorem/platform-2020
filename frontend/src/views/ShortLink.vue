<template>
  <div class="about">
    <LoadingSpinner />
  </div>
</template>

<script>
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import generalMixin from '../mixins/general';

export default {
  name: 'Shortlink',
  mixins: [generalMixin],
  components: {
    LoadingSpinner,
  },
  async mounted() {
    const params = {
      shortlinks: this.$route.params.shortlink,
    };
    const shortlink = await this.performGetRequest(this.getEnvVariable('SCHEDULE_BASE_ENDPOINT'), 'get_shortlink', params);

    if (shortlink && shortlink.link) {
      const postParams = {
        link_id: shortlink.id,
        user_id: this.getUserId(),
      };
      this.performPostRequest(this.getEnvVariable('SCHEDULE_BASE_ENDPOINT'), 'add_shortlink_click', postParams);
      window.location = shortlink.link;
    } else {
      // redirect to 404
      this.$router.push('404');
    }
  },
};
</script>
