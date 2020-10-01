<template>
  <div class="page-container">
    <div class="register-container">
      <content-container v-if="displayWelcomeScreen">
        <template v-slot:title>
          <h3>Welcome!</h3>
        </template>
        <template v-slot:progress><ProgressCircles v-bind:full="0" v-bind:half="0" v-bind:empty="5" /></template>
        <template v-slot:body>
          <p class="description-text">Welcome to Technica! To set up your account, you'll have to go through a few steps:</p>
          <ol class="step-list">
            <li>Update Information</li>
            <li>Verify You're a Student</li>
            <li>Sign the Event Waiver</li>
            <li>Create a Hacker Profile (Optional)</li>
            <li>Set Up Your Slack Account</li>
          </ol>
          <p class="description-text">Ready to get hacking? Click "Get Started" to begin!</p>
          <Button size="lg" text="Get Started" @click="getStarted()"/>
        </template>
      </content-container>

      <content-container v-if="displayProfileInfoScreen">
        <template v-slot:title>
          <h3>Register</h3>
        </template>
        <template v-slot:progress><ProgressCircles v-bind:full="0" v-bind:half="1" v-bind:empty="4" /></template>
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
                <input type="text" class="form-control mx-auto" id="pronounInput" placeholder="e.g. she/her" v-model="pronouns">
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
                <input type="text" class="form-control mx-auto" id="schoolInput" placeholder="e.g. University of Maryland, College Park" v-model="school">
              </div>
            </div>
          </form>
          <p v-if="displayIncompleteInfoMessage" class="text-error">Please fill out all profile fields.</p>
          <p v-if="emailIsInvalid" class="text-error">Please enter a valid email address.</p>
          <Button size="lg" text="Next" @click="goToProfile()"/>
        </template>
      </content-container>

      <content-container v-if="displayEnrollmentVerificationScreen">
        <template v-slot:title>
          <h3>Register</h3>
        </template>
        <template v-slot:progress><ProgressCircles v-bind:full="1" v-bind:half="1" v-bind:empty="3" /></template>
        <template v-slot:body>
          <h5>2) Verify You're a Student</h5>
          <p class="description-text">Please upload any kind of document or identification that proves you're a current student. This can be a photo of your school ID, a transcript or class schedule, or any other document that shows you're currently in school. Any file type is accepted (.png, .pdf, etc.)</p>
          <p class="description-text">If you have any questions or you're not a student, please contact us by clicking the chat box in the lower right corner.</p>
          <div class="enrollment-verification-form-wrapper">
            <b-form-file
              v-model="enrollmentVerificationFileUpload"
              :state="Boolean(enrollmentVerificationFileUpload)"
              placeholder="Choose a file"
              drop-placeholder="Drop file here..."
            ></b-form-file>
          </div>
          <Button size="lg" text="Next" @click="proceedToWaiverScreen()"/>
        </template>
      </content-container>

      <content-container v-if="displayWaiverScreen">
        <template v-slot:title>
          <h3>Register</h3>
        </template>
        <template v-slot:progress><ProgressCircles v-bind:full="2" v-bind:half="1" v-bind:empty="2" /></template>
        <template v-slot:body>
          <h5>3) Sign the Event Waiver</h5>
          <p class="description-text">The safety and happiness of our attendees is our #1 priority, and it's vital that everyone adheres to our online code of conduct and waiver during the event. Please make sure you've signed the online waiver before proceeding.</p>
          <Button v-if="!docusignLinkButtonClicked" size="lg" text="Sign the Waiver" @click="signWaiver()" :outlineStyle="true"/>
          <Button v-else size="lg" text="I've Signed the Waiver" @click="proceedToHackerProfileDescriptionScreen()"/>
        </template>
      </content-container>

      <content-container v-if="displayHackerProfileDescriptionScreen">
        <template v-slot:title>
          <h3>Register</h3>
        </template>
        <template v-slot:progress><ProgressCircles v-bind:full="3" v-bind:half="1" v-bind:empty="1" /></template>
        <template v-slot:body>
          <h5>4) Your Hacker Profile</h5>
          <p class="description-text">Your hacker profile is an optional way for you to share more information about yourselves with the event sponsors. Describe yourself in 1-2 sentences:</p>
          <form>
            <textarea id="exampleFormControlTextarea1" rows="4" class="form-control hacker-profile-text" v-model="profile_text"></textarea>
          </form>
          <Button size="lg" text="Next" @click="proceedToSlackStep()"/>
        </template>
      </content-container>

      <content-container v-if="displaySlackSetupScreen">
        <template v-slot:title>
          <h3>Register</h3>
        </template>
        <template v-slot:progress><ProgressCircles v-bind:full="4" v-bind:half="1" v-bind:empty="0" /></template>
        <template v-slot:body>
          <h5>5) Set Up Your Slack Account </h5>
          <p class="description-text">We'll be using Slack to share announcements, chat with other hackers, and more! Click the link below to register for our slack workspace, and come back once you're finished.</p>
          <Button v-if="!slackLinkButtonClicked" size="lg" text="Join Slack" @click="joinSlack()" :outlineStyle="true"/>
          <Button v-else size="lg" text="I've Joined Slack" @click="goHome()"/>
        </template>
      </content-container>
    </div>
  </div>
</template>

<script>
import Button from '@/components/Button.vue';
import ContentContainer from '@/components/ContentContainer.vue';
import ProgressCircles from '@/components/ProgressCircles.vue';
import generalMixin from '../mixins/general';

export default {
  name: 'Register',
  components: {
    Button,
    ContentContainer,
    ProgressCircles,
  },
  mixins: [generalMixin],
  data() {
    return {
      displayWelcomeScreen: true,
      displayProfileInfoScreen: false,
      displayEnrollmentVerificationScreen: false,
      displayHackerProfileDescriptionScreen: false,
      displaySlackSetupScreen: false,
      displayWaiverScreen: false,
      displayIncompleteInfoMessage: false,
      emailIsInvalid: false,
      name: '',
      email: '',
      school: '',
      phone: '',
      pronouns: '',
      profile_text: '',
      slackLinkButtonClicked: false,
      docusignLinkButtonClicked: false,
      enrollmentVerificationFileUpload: null,
      currRegistrationStep: 0,
      totalRegistrationStep: 6,
    };
  },
  async mounted() {
    await this.getUser();
  },
  methods: {
    getStarted() {
      this.displayWelcomeScreen = false;
      this.displayProfileInfoScreen = true;
    },
    proceedToSlackStep() {
      this.displayHackerProfileDescriptionScreen = false;
      this.displaySlackSetupScreen = true;
    },
    proceedToHackerProfileDescriptionScreen() {
      this.displayWaiverScreen = false;
      this.displayHackerProfileDescriptionScreen = true;
    },
    proceedToWaiverScreen() {
      this.displayEnrollmentVerificationScreen = false;
      this.displayWaiverScreen = true;
    },
    goToProfile() {
      if (this.profileInformationCompleted && this.emailAddressIsValid) {
        const postParams = {
          id: this.getUserId(),
          email: this.email,
          pronouns: this.pronouns,
          full_name: this.name,
          school: this.school,
          phone: this.phone,
        };
        this.performPostRequest(this.getEnvVariable('USERS_BASE_ENDPOINT'), 'update_user', postParams);
        this.displayEnrollmentVerificationScreen = true;
        this.displayProfileInfoScreen = false;
        this.setUserNameCookie(this.name.split(' ')[0]);
      } else if (!this.profileInformationCompleted) {
        this.displayIncompleteInfoMessage = true;
        this.emailIsInvalid = false;
      } else {
        this.emailIsInvalid = true;
        this.displayIncompleteInfoMessage = false;
      }
    },
    goHome() {
      this.$router.push('/');
      const postParams = {
        id: this.getUserId(),
        profile_text: this.profile_text,
        registration_status: 'registered',
      };
      this.performPostRequest(this.getEnvVariable('USERS_BASE_ENDPOINT'), 'update_user', postParams);

      // add easter egg data
      const easterEggPostParams = {
        user_id: this.getUserId(),
      };
      this.performPostRequest(this.getEnvVariable('ADMIN_BASE_ENDPOINT'), 'add_easter_eggs_for_user', easterEggPostParams);
    },
    joinSlack() {
      window.open(this.getEnvVariable('SLACK_INVITE_LINK'), '_blank');
      this.slackLinkButtonClicked = true;
    },
    signWaiver() {
      window.open(this.getEnvVariable('DOCUSIGN_WAIVER_LINK'), '_blank');
      this.docusignLinkButtonClicked = true;
    },
    async getUser() {
      const userParams = {
        id: this.getUserId(),
      };
      const user = await this.performGetRequest(this.getEnvVariable('USERS_BASE_ENDPOINT'), 'get_user', userParams);
      if (user) {
        if (user.full_name) {
          this.name = user.full_name;
        }
        if (user.pronouns) {
          this.pronouns = user.pronouns;
        }
        if (user.email) {
          this.email = user.email;
        }
        if (user.phone) {
          this.phone = user.phone;
        }
        if (user.school) {
          this.school = user.school;
        }
        if (user.profile_text) {
          this.profile_text = user.profile_text;
        }
      }
    },
  },
  computed: {
    profileInformationCompleted() {
      return this.email !== '' && this.pronouns !== '' && this.full_name !== '' && this.school !== '' && this.phone !== '';
    },
    emailAddressIsValid() {
      return this.email !== '' && this.email.includes('@') && this.email.includes('.');
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

  .description-text {
    color: #CA484F;
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
    color: rgb(0, 0, 0);
  }

  .form-control::placeholder {
    color: rgba(0, 0, 0, .6);
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

  .enrollment-verification-form-wrapper {
    padding-left: 20%;
    padding-right: 20%;
    margin-bottom: 1rem;
  }

  @media (max-width: 1500px) {
    .enrollment-verification-form-wrapper {
      padding-left: 10%;
      padding-right: 10%;
    }
  }
</style>
