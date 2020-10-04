<template>
  <div class="page-container">
    <div class="login-container">
      <content-container v-if="!loginButtonClicked">
        <template v-slot:title>
          <h3>Login</h3>
        </template>
        <template v-slot:body>
          <p class="description-text">Instead of using a password, enter your email so Hack the Mountains can send you a magic link to sign in.</p>
          <p v-if="emailNotFound && !emailInvalid" class="text-error">We could not find your email in our records. For further assistance, please contact our support team.</p>
          <p v-if="emailInvalid" class="text-error">Please enter a valid email address.</p>
          <form @submit.prevent="sendMagicLink">
            <div class="form-group mx-auto">
              <input type="email" class="form-control mx-auto" id="emailInput" placeholder="Email" v-model="userEmail">
            </div>
            <Button size="lg" text="Send Me a Magic Link" @click="sendMagicLink"/>
            <div class="login-footer">
              <span style="padding-right: .75rem">or</span>
              <a :href="signupFormLink" target="_blank">
                <Button size="lg" text="Sign Up" :outlineStyle="true"/>
              </a>
            </div>
          </form>
        </template>
      </content-container>

      <content-container v-else>
        <template v-slot:title>
          <h3>Check Your Email...</h3>
        </template>
        <template v-slot:body>
          <p class="description-text" style="margin-bottom: 3rem">We sent an email to <b>{{ userEmail }}</b>! It has a magic link to help sign you in to Technica.</p>
          <img alt="Mail icon" src="../assets/mail-icon.svg"  height="120">
        </template>
      </content-container>
    </div>
  </div>
</template>

<script>
import Button from '@/components/Button.vue';
import ContentContainer from '@/components/ContentContainer.vue';
import generalMixin from '@/mixins/general';

export default {
  name: 'Login',
  components: {
    Button,
    ContentContainer,
  },
  mixins: [generalMixin],
  data() {
    return {
      loginButtonClicked: false,
      userEmail: '',
      emailNotFound: false,
      emailInvalid: false,
    };
  },
  methods: {
    async sendMagicLink() {
      if (this.userEmail !== '' && this.userEmail.includes('@')) {
        const getParams = {
          email: this.userEmail,
        };
        const user = await this.performGetRequest(this.getEnvVariable('USERS_BASE_ENDPOINT'), 'find_user_by_email', getParams);

        if (user[0]) {
          const postParams = {
            id: user[0].id,
            setRegistrationStatus: false,
          };
          this.performPostRequest(this.getEnvVariable('USERS_BASE_ENDPOINT'), 'invite_user', postParams);
          this.loginButtonClicked = true;
        } else {
          this.emailInvalid = false;
          this.emailNotFound = true;
        }
      } else {
        this.emailInvalid = true;
      }
    },
    verifyUserId() {
      if ((!this.getUserId())) {
        this.$router.push('Login');
      }
    },
  },
  watch: {
    $route(to) { // watch route changes and kick the user out if they're not properly logged in
      if (to.name !== 'Login') {
        this.verifyUserId();
      }
    },
  },
  computed: {
    signupFormLink() {
      return this.getEnvVariable('SIGNUP_FORM_LINK');
    },
  },
};
</script>

<style scoped>
  .page-container {
    /* background: conic-gradient(from 212.03deg at 50% 33.82%,rgb(255,107,152, .6) -123.4deg, rgb(182,161,196, .6) 11.75deg, rgb(35,216,216, .6) 79.77deg, rgb(255,107,152, .6) 236.6deg, rgb(182,161,196, .6) 371.75deg); */
    background: linear-gradient(to bottom, rgba(233, 174, 145, .25) 0%, rgba(202, 72, 79, .25) 33%, rgba(247, 208, 203, .25) 66%, rgba(214, 109, 80, .25) 100%);
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

  @media (min-width: 900px) {
    .form-control {
      max-width: 415px;
    }
  }

  .description-text {
    color: #CA484F;
  }

  .login-footer {
    margin-bottom: 3rem;
  }

  .text-error {
    color: red;
  }
</style>
