<template>
  <div class="about">
    <h1>This is a shortlink page</h1>
  </div>
</template>

<script>
import generalMixin from '../mixins/general';
import Config from '../config/general';
export default {
  name: 'Shortlink',
  mixins: [generalMixin],
  data(){
    return {

    }
  },
  async mounted(){
    this.setUserIdCookie(Config.dev.SAMPLE_USER_ID);
    const params = {
        id: this.$route.params.shortlink
    }
    const shortlink = await this.performGetRequest(Config.dev.SCHEDULE_BASE_ENDPOINT, "dev", "get_shortlink", params);

    if(shortlink && shortlink.link) {
        const postParams = {
            link_id: shortlink.id,
            user_id: this.getUserId()
        }
        const postResult = await this.performPostRequest(Config.dev.SCHEDULE_BASE_ENDPOINT, "dev", "add_shortlink_click", postParams);
        window.location = shortlink.link;
    } else {
        // redirect to 404
        this.$router.push('404'); 
    }
  }
};
</script>