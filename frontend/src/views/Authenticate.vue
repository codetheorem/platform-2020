<template>
  <div>
  </div>
</template>

<script>
import generalMixin from '../mixins/general';
import Config from '../config/general';

export default {
  name: 'Shortlink',
  mixins: [generalMixin],
  data() {
    return {

    };
  },
  async created() {
    const params = {
      id: this.$route.query.token,
    };
    const env = this.getCurrentEnvironment();
    const userId = await this.performGetRequest(Config[env].USERS_BASE_ENDPOINT, env, 'get_user', params);
    console.log(userId);
    // if user does not exist, redirect to login screen
    if (userId && userId.id) {
      this.setUserIdCookie(this.$route.query.token);
      this.$router.push('/');
    } else {
      this.$router.push('Login');
    }
  },
};
</script>
