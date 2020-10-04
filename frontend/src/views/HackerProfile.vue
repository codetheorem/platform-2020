<template>
  <div class="page-container">
    <div v-if="dataLoaded" class="display-container">
        <div class="profile-header">
            <img v-bind:src="getImgUrl(photos[0])" class="member-list-photo"/>
            <div class="profile-header-title">
                <div class="profile-header-name">
                    <h3>{{ profile.full_name }}</h3>
                    <h6>{{ profile.pronouns }}</h6>
                    <p>{{ profile.profile_text }}</p>
                </div>
            </div>
        </div>
        <p>Your hacker profile is an optional way for you to share more information about yourself with the event sponsors. Only sponsors can see this information.</p>
        <div class="profile-footer">
            <div class="profile-footer-box">
                <h5 class="profile-footer-box-title">Contact and Connect:</h5>
                <p v-if="profile.email" class="profile-footer-box-content"><a :href="'mailto:' + profile.email" target="_blank">My Email</a></p>
                <p v-if="profile.linkedin" class="profile-footer-box-content"><a :href="profile.linkedin" target="_blank">My LinkedIn</a></p>
                <p v-if="profile.github" class="profile-footer-box-content"><a :href="profile.github" target="_blank">My Github</a></p>
                <p v-if="!profile.linkedin && !profile.github">Add more contact information by clicking the edit button below!</p>
            </div>
            <div class="profile-footer-box">
                <h5 class="profile-footer-box-title">Academics:</h5>
                <p v-if="profile.school" class="profile-footer-box-content">School: {{ profile.school }}</p>
                <p v-if="profile.gpa" class="profile-footer-box-content">GPA: {{ profile.gpa }}</p>
                <p v-if="profile.year" class="profile-footer-box-content">{{ profile.year }}</p>
                <p v-if="!profile.gpa && !profile.year">Add more academic information by clicking the edit button below!</p>
            </div>
            <div class="profile-footer-box">
                <h5 class="profile-footer-box-title">Our Hack:</h5>
                <p v-if="profile.project_description" class="profile-footer-box-content">{{ profile.project_description }}</p>
                <p v-if="profile.devpost" class="profile-footer-box-content"><a :href="profile.devpost" target="_blank">Link to Project <img src="../assets/link.svg" style="margin-left: .5rem;"></a></p>
                <p v-if="!profile.project_description">Add information about your Technica project by clicking the edit button below!</p>
            </div>
        </div>
        <div class="profile-bottom">
          <Button size="lg" text="Edit Information" :editButton="true" @click="openModal()"/>
        </div>
    </div>
    <LoadingSpinner v-else />
    <b-modal id="editProfileModal" title="Edit Profile" size="xl" centered>
      <div class="modal-body">
        <div class="modal-half">
          <h5>1) Basic Information</h5>
          <form @submit.prevent="goToProfile">
            <div class="form-group">
              <div class="input-wrapper">
                <label for="exampleInputEmail1" class="input-label">My Name</label>
                <input type="text" class="form-control mx-auto" id="nameInput" placeholder="Grace Hopper" v-model="profile.full_name">
              </div>
              <div class="input-wrapper">
                <label for="exampleInputEmail1" class="input-label">My Pronouns</label>
                <input type="text" class="form-control mx-auto" id="pronounInput" placeholder="e.g. she/her" v-model="profile.pronouns">
              </div>
              <div class="input-wrapper">
                <label for="exampleInputEmail1" class="input-label">My Email</label>
                <input type="email" class="form-control mx-auto" id="emailInput" placeholder="hello@gotechnica.org" v-model="profile.email">
              </div>
              <div class="input-wrapper">
                <label for="exampleInputEmail1" class="input-label">LinkedIn</label>
                <input type="text" class="form-control mx-auto" id="linkedinInput" placeholder="https://www.linkedin.com/in/example-username" v-model="profile.linkedin">
              </div>
              <div class="input-wrapper">
                <label for="exampleInputEmail1" class="input-label">Github</label>
                <input type="text" class="form-control mx-auto" id="githubInput" placeholder="https://github.com/example" v-model="profile.github">
              </div>
              <form>
                <label for="exampleFormControlTextarea1" class="input-label">Bio</label>
                <textarea id="exampleFormControlTextarea1" rows="3" class="form-control hacker-profile-text" v-model="profile.profile_text" placeholder="e.g. I'm a computer science student at the University of Maryland who loves to code!"></textarea>
              </form>
            </div>
          </form>
        </div>
        <div class="modal-half">
          <h5>3) Academics</h5>
          <form @submit.prevent="goToProfile">
            <div class="form-group">
              <div class="input-wrapper">
                <label for="exampleInputEmail1" class="input-label">School</label>
                <input type="email" class="form-control mx-auto" id="schoolInput" placeholder="e.g. University of Maryland, College Park" v-model="profile.school">
              </div>
              <div class="input-wrapper">
                <label for="exampleInputEmail1" class="input-label">GPA</label>
                <input type="text" class="form-control mx-auto" id="gpaInput" placeholder="My GPA" v-model="profile.gpa">
              </div>
              <div class="input-wrapper">
                <label for="exampleInputEmail1" class="input-label">Major</label>
                <input type="text" class="form-control mx-auto" id="majorInput" placeholder="e.g. Computer Science" v-model="profile.major">
              </div>
              <div class="input-wrapper">
                <label for="exampleInputEmail1" class="input-label">Year</label>
                <input type="text" class="form-control mx-auto" id="yearInput" placeholder="e.g. College Junior" v-model="profile.year">
              </div>
            </div>
          </form>
          <h5>4) Hack</h5>
          <form @submit.prevent="goToProfile">
            <div class="form-group">
              <div class="input-wrapper">
                <label for="exampleInputEmail1" class="input-label">Devpost Project Link</label>
                <input type="email" class="form-control mx-auto" id="schoolInput" placeholder="https://devpost.com/software/example" v-model="profile.devpost">
              </div>
              <form>
                <label for="exampleFormControlTextarea1" class="input-label">2 Sentence Description of Project</label>
                <textarea id="exampleFormControlTextarea1" rows="3" class="form-control hacker-profile-text" v-model="profile.project_description" placeholder="e.g. For my Technica project, we designed a cool website."></textarea>
              </form>
            </div>
          </form>
        </div>
      </div>
      <template v-slot:modal-footer>
          <Button text="Save" @click="closeModal()" size="sm"/>
      </template>
    </b-modal>
  </div>
</template>

<script>
import generalMixin from '../mixins/general';
import Config from '../config/general';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';

export default {
  name: 'HackerProfile',
  mixins: [generalMixin],
  components: {
    Button,
    LoadingSpinner,
  },
  data() {
    return {
      currentTeam: null,
      photos: ['Profile Sun', 'Profile Mountain', 'Profile Cloud 2', 'Profile Wave', 'Profile Cloud 1'],
      user: null,
      profile: {},
      dataLoaded: false,
    };
  },
  async mounted() {
    await this.getUser();
    this.dataLoaded = true;
  },
  methods: {
    async getUser() {
      const env = this.getCurrentEnvironment();
      const userParams = {
        id: this.getUserId(),
      };
      this.user = await this.performGetRequest(Config[env].USERS_BASE_ENDPOINT, env, 'get_user', userParams);
      if (this.user.hacker_profile) {
        this.profile = this.user.hacker_profile;
      } else {
        this.profile = this.user;
        await this.updateProfile();
        await this.getUser();
      }
    },
    async updateProfile() {
      const env = this.getCurrentEnvironment();
      const userParams = {
        id: this.getUserId(),
        hacker_profile: this.profile,
      };
      await this.performPostRequest(Config[env].USERS_BASE_ENDPOINT, env, 'update_user', userParams);
    },
    getImgUrl(imgName) {
      const images = require.context('../assets/profile_pics', false, /\.png$/);
      return images(`./${imgName}.png`);
    },
    openModal() {
      this.$bvModal.show('editProfileModal');
    },
    closeModal() {
      this.$bvModal.hide('editProfileModal');
      this.updateProfile();
    },
  },
};
</script>

<style scoped>
h2 {
  color: var(--bright-purple);
}

.page-container {
    width: 100vw;
    height: 100vh;
    display: flex;
   justify-content: center;
}

.display-container {
    width: 70vw;
}

.member-list-item {
    width: 100%;
    border: 2px solid #A88AA8;
    box-sizing: border-box;
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    display: flex;
}

.member-list-photo {
    background: #C4C4C4;
    border-radius: 8px;
    width: 13rem;
    height: 13rem;
    margin: 3px;
}

.member-list-info {
    margin-top: 1rem;
    margin-bottom: 2rem;
    margin-right: 1rem;
    margin-left: .75rem;
    border-radius: 4px;
}

.profile-header {
    height: 40%;
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
}

.profile-footer {
    height: 30%;
    width: 100%;
    display: flex;
    justify-content: space-around;
}

.profile-header-title {
    width: 50%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    color: #000000;
}

.profile-header-name {
    text-align: left;
}

.profile-footer-box {
    background: #FFF;
    padding-top: 1rem;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    border: 2px solid #B6A1C4;
    box-sizing: border-box;
    border-radius: 8px;
    flex: 0 0 30%;
    height: 80%;
}

.profile-footer-box-title {
    color: #B6A1C4;
    font-family: DIN Pro;
    font-style: normal;
    font-weight: bold;
    font-size: 24px;
    margin-top: 1rem;
}

.profile-footer-box-content {
    /* font-weight: bold; */
    font-size: 18px;
    color: #000000;
    font-family: DIN Pro;
}

.profile-bottom {
  display: flex;
  justify-content: flex-start;
  padding: 1rem;
}

.modal-body {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
}

.modal-half {
  width: 50%;
  height: 60vh;
  padding: 1rem;
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

@media (max-width: 1200px) {
  .display-container {
    width: 90vw;
  }

  .modal-half {
    height: 80vh;
  }
}
</style>
