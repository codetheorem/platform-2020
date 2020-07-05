<template>
  <div class="page-container">
    <div class="login-container">
      <div v-if="!loginButtonClicked" class="container content-container col-md-7 col-lg-8 col-xl-4">
        <div class="content-container-title">
          <h3>Login</h3>
        </div>
        <div class="content-container-body">
          <p class="description-text">This is a short explanation of whatever a magic link is supposed to do, so they know to check their email instead of password.</p>
          <form @submit="sendMagicLink">
            <div class="form-group mx-auto">
              <input type="email" class="form-control mx-auto" id="emailInput" placeholder="Email" v-model="userEmail">
            </div>
            <Button size="lg" text="Send Me a Magic Link" @click="sendMagicLink"/>
            <div class="login-footer">
              <span>or </span>
              <Button size="lg" text="Sign Up" :outlineStyle="true"/>
            </div>
          </form>
        </div>
      </div>

      <div v-else class="container content-container col-md-7 col-lg-8 col-xl-4">
        <div class="content-container-title">
          <h3>Check Your Email</h3>
        </div>
        <div class="content-container-body">
          <p class="description-text" style="margin-bottom: 3rem">We sent an email to {{ userEmail }}! It has a magic link to help sign you in to Technica!</p>
          <img alt="Mail icon" src="../assets/mail-icon.svg"  height="120">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Button from '@/components/Button.vue';

export default {
  name: 'Login',
  components: {
    Button
  },
  data() {
    return {
      loginButtonClicked: false,
      userEmail: ''
    }
  },
  methods: {
    sendMagicLink(){
      this.loginButtonClicked = true;

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
</style>
