<template>
  <div class="about">
    <LoadingSpinner />
  </div>
</template>

<script>
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import generalMixin from '../mixins/general';
import Config from '../config/general';

export default {
  name: 'Shortlink',
  mixins: [generalMixin],
  components: {
    LoadingSpinner,
  },
  async mounted() {
    const env = this.getCurrentEnvironment();
    const params = {
      shortlinks: this.$route.params.shortlink,
    };
    const shortlink = await this.performGetRequest(Config[env].SCHEDULE_BASE_ENDPOINT, env, 'get_shortlink', params);

    if (shortlink && shortlink.link) {
      const postParams = {
        link_id: shortlink.id,
        user_id: this.getUserId(),
      };
      this.performPostRequest(Config[env].SCHEDULE_BASE_ENDPOINT, env, 'add_shortlink_click', postParams);
      window.location = shortlink.link;
    } else {
      // redirect to 404
      this.$router.push('404');
    }
  },
};
</script>
