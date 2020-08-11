<template>
  <div class="page-container">
    <div class="register-container">
      <content-container v-if="!getStartedButtonClicked">
        <template v-slot:title>
          <h3>Welcome!</h3>
        </template>
        <template v-slot:body>
          <p class="description-text">Welcome to Technica! To set up your account, you'll have to go through a few steps:</p>
          <ol class="step-list">
            <li>Update Information</li>
            <li>Create a Hacker Profile (Optional)</li>
            <!-- These items will be added as supplemental features -->
            <!-- <li>Favorite Events (Optional)</li>
            <li>Sign Forms</li> -->
          </ol>
          <p class="description-text">Ready to get hacking? Click "Get Started" to begin!</p>
          <Button size="lg" text="Get Started" @click="getStarted()"/>
        </template>
      </content-container>

      <content-container v-if="getStartedButtonClicked && !nextButtonClicked">
        <template v-slot:title>
          <h3>Register</h3>
        </template>
        <template v-slot:body>
          <h5>1) A Little About You</h5>
          <form @submit.prevent="goToProfile">
            <div class="form-group">
              <div class="input-wrapper">
                <label for="exampleInputEmail1" class="input-label">My Name</label>
                <input type="text" class="form-control mx-auto" id="nameInput" placeholder="Grace Hopper" v-model="name">
              </div>
              <div class="input-wrapper">
                <label for="exampleInputEmail1" class="input-label">My Pronouns</label>
                <input type="text" class="form-control mx-auto" id="pronounInput" placeholder="she/her" v-model="pronoun">
              </div>
              <div class="input-wrapper">
                <label for="exampleInputEmail1" class="input-label">My Email</label>
                <input type="email" class="form-control mx-auto" id="emailInput" placeholder="hello@gotechnica.org" v-model="email">
              </div>
              <div class="input-wrapper">
                <label for="exampleInputEmail1" class="input-label">My Phone Number</label>
                <input type="phone" class="form-control mx-auto" id="phoneInput" placeholder="(XXX) XXX - XXXX" v-model="phone">
              </div>
              <div class="input-wrapper">
                <label for="exampleInputEmail1" class="input-label">My School</label>
                <input type="text" class="form-control mx-auto" id="schoolInput" placeholder="University of Maryland, College Park" v-model="school">
              </div>
            </div>
          </form>
          <Button size="lg" text="Next" @click="goToProfile()"/>
        </template>
      </content-container>

      <content-container v-if="nextButtonClicked">
        <template v-slot:title>
          <h3>Register</h3>
        </template>
        <template v-slot:body>
          <h5>2) Your Hacker Profile</h5>
          <p class="description-text">Your hacker profile is an optional way for you to share more information about yourselves with the event sponsors. Describe yourself in 1-2 sentences:</p>
          <form>
            <textarea id="exampleFormControlTextarea1" rows="4" class="form-control hacker-profile-text" v-model="profile_text"></textarea>
            <!-- <Button size="lg" text="Upload Profile Picture" @click="goToProfile()"/> -->
          </form>
          <Button size="lg" text="Finish" @click="goHome()"/>
        </template>
      </content-container>
    </div>
  </div>
</template>

<script>
import Button from '@/components/Button.vue';
import ContentContainer from '@/components/ContentContainer.vue';
import generalMixin from '../mixins/general';
import Config from '../config/general';

export default {
  name: 'Register',
  components: {
    Button,
    ContentContainer,
  },
  mixins: [generalMixin],
  data() {
    return {
      getStartedButtonClicked: false,
      nextButtonClicked: false,
      name: '',
      email: '',
      school: '',
      phone: '',
      profile_text: '',
    };
  },
  methods: {
    getStarted() {
      this.getStartedButtonClicked = true;
    },
    goToProfile() {
      const env = this.getCurrentEnvironment();
      const postParams = {
        id: this.getUserId(),
        email: this.email,
        pronoun: this.pronoun,
        full_name: this.name,
        school: this.school,
        phone: this.phone,
      };
      this.performPostRequest(Config[env].USERS_BASE_ENDPOINT, env, 'update_user', postParams);
      this.nextButtonClicked = true;
      this.setUserNameCookie(this.name.split(' ')[0]);
    },
    goHome() {
      this.$router.push('/');
      const env = this.getCurrentEnvironment();
      const postParams = {
        id: this.getUserId(),
        profile_text: this.profile_text,
        registration_status: 'registered',
      };
      this.performPostRequest(Config[env].USERS_BASE_ENDPOINT, env, 'update_user', postParams);
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

  .register-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 90%;
  }

  @media (min-width: 900px) {
    .form-control {
      /* max-width: 415px; */
    }
  }

  .description-text {
    color: #A88AA8;
  }

  .text-error {
    color: red;
  }

  .step-list {
    text-align: left;
    padding-left: 8rem;
  }

  .form-control {
    margin-bottom: .5rem;
  }

  .input-label {
    margin-bottom: 0;
    color: #000000;
    font-family: Noto Sans;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
  }

  .input-wrapper {
    text-align: left;
  }

  .hacker-profile-text {
    margin-bottom: 1rem;
  }
</style>
