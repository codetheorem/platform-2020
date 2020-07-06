<template>
  <div class="page-container">
    <div class="login-container">
      <div v-if="!loginButtonClicked" class="container content-container col-md-7 col-lg-8 col-xl-4">
        <div class="content-container-title">
          <h3>Login</h3>
        </div>
        <div class="content-container-body">
          <p class="description-text">Instead of using a complex password, enter your email so Technica can send you a magic link to sign in.</p>
          <p v-if="emailNotFound" class="text-error">We could not find your email in our records. For further assistance, please contact our support team.</p>
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
        </div>
      </div>

      <div v-else class="container content-container col-md-7 col-lg-8 col-xl-4">
        <div class="content-container-title">
          <h3>Check Your Email...</h3>
        </div>
        <div class="content-container-body">
          <p class="description-text" style="margin-bottom: 3rem">We sent an email to <b>{{ userEmail }}</b>! It has a magic link to help sign you in to Technica.</p>
          <img alt="Mail icon" src="../assets/mail-icon.svg"  height="120">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Button from '@/components/Button.vue';
import Config from '../config/general';

export default {
  name: 'Login',
  components: {
    Button
  },
  data() {
    return {
      loginButtonClicked: false,
      userEmail: '',
      emailNotFound: false,
      emailInvalid: false
    }
  },
  methods: {
    sendMagicLink(){
      if(this.userEmail != '') {
        this.loginButtonClicked = true;
      } else {
        this.emailInvalid = true;
      }
    }
  },
  computed: {
    signupFormLink(){
      return Config.dev.SIGNUP_FORM_LINK;
    }
  }
};
</script>


<style>
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
