<template>
  <div class="page-container">
    <div class="login-container">
      <div class="container content-container col-md-7 col-lg-8 col-xl-4">
        <div class="content-container-title">
          <h3>Log Out of Technica?</h3>
        </div>
        <div class="content-container-body">
          <p class="description-text">You can always log back in at any time via a new magic link.</p>
          <Button size="lg" text="Cancel" @click="goBack" :outlineStyle="true" style="margin-right: 2rem;"/>
          <Button size="lg" text="Log Out" @click="logout"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Button from '@/components/Button.vue';
import GeneralMixin from '../mixins/general';

export default {
  name: 'Logout',
  components: {
    Button,
  },
  mixins: [GeneralMixin],
  data() {
    return {
      loginButtonClicked: false,
      userEmail: '',
      emailNotFound: false,
      emailInvalid: false,
    };
  },
  methods: {
    logout() {
      this.removeUserIdCookie();
      this.removeUserNameCookie();
      this.removeUserGroupCookie();
      this.removeSponsorBoothIdCookie();
      this.$router.push('Login');
    },
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped>
  .page-container {
    background: conic-gradient(from 212.03deg at 50% 33.82%,rgb(255,107,152, .6) -123.4deg, rgb(182,161,196, .6) 11.75deg, rgb(35,216,216, .6) 79.77deg, rgb(255,107,152, .6) 236.6deg, rgb(182,161,196, .6) 371.75deg);
    backdrop-filter: blur(40px);
    width: 100vw;
    height: 100vh;
  }

  .login-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 90%;
  }

  .content-container {
    background: #FFFFFF;
    border-radius: 8px;
    padding: 3rem;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 4px;
  }

  @media (max-width: 800px) {
    .content-container {
      padding: 1rem;
    }
  }

  @media (min-width: 900px) {
    .form-control {
      max-width: 415px;
    }
  }

  .content-container-title {
    margin-top: 3rem;
  }

  .description-text {
    color: #A88AA8;
  }

  .login-footer {
    margin-bottom: 3rem;
  }

  .text-error {
    color: red;
  }
</style>
