<template>
  <div>
    <LoadingSpinner />
  </div>
</template>

<script>
import generalMixin from '../mixins/general';
import LoadingSpinner from '../components/LoadingSpinner.vue';

export default {
  name: 'Shortlink',
  mixins: [generalMixin],
  components: {
    LoadingSpinner,
  },
  async created() {
    const params = {
      id: this.$route.query.token,
    };
    const user = await this.performGetRequest(this.getEnvVariable('USERS_BASE_ENDPOINT'), 'get_user', params);
    // if user does not exist, redirect to login screen
    if (user && user.id) {
      this.setUserIdCookie(this.$route.query.token);
      if (!user.registration_status || user.registration_status === 'email_invite_sent') {
        this.$router.push('Register');
      } else {
        this.$router.push('/');
        this.setUserNameCookie(user.full_name.split(' ')[0]);
        this.setUserGroupCookie(user.group);
        this.setSponsorBoothIdCookie(user.sponsor_booth);
        this.$emit('teamMembershipChanged', true);
      }
    } else {
      this.$router.push('Login');
    }
  },
};
</script>
