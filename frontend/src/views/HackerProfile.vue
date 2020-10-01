<template>
  <div class="page-container">
    <div class="display-container">
        <div class="profile-header">
            <img v-bind:src="getImgUrl(photos[0])" class="member-list-photo"/>
            <div class="profile-header-title">
                <div class="profile-header-name">
                    <h3>{{ user.full_name }}</h3>
                    <h6>{{ user.pronouns }}</h6>
                    <p>{{ user.profile_text }}</p>
                </div>
            </div>
        </div>
        <div class="profile-footer">
            <div class="profile-footer-box">
                <h5 class="profile-footer-box-title">Contact and Connect:</h5>
                <p class="profile-footer-box-content">+ <a :href="'mailto:' + user.email">{{ user.email }}</a></p>
                <p class="profile-footer-box-content">+ <a href="https://linkedin.com">LinkedIn</a></p>
                <p class="profile-footer-box-content">+ <a href="https://github.com">Github</a></p>
            </div>
            <div class="profile-footer-box">
                <h5 class="profile-footer-box-title">Academics:</h5>
                <p class="profile-footer-box-content">+ {{ user.school }}</p>
                <p class="profile-footer-box-content">+ GPA: 4.0</p>
                <p class="profile-footer-box-content">+ Class of 2020</p>
            </div>
            <div class="profile-footer-box">
                <h5 class="profile-footer-box-title">Our Hack:</h5>
                <p class="profile-footer-box-content">For our Technica project, we designed a cool website. Please check it out!!</p>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import generalMixin from '../mixins/general';

export default {
  name: 'HackerProfile',
  mixins: [generalMixin],
  data() {
    return {
      currentTeam: null,
      photos: ['Profile Sun', 'Profile Mountain', 'Profile Cloud 2', 'Profile Wave', 'Profile Cloud 1'],
      user: null,
    };
  },
  async mounted() {
    await this.getUser();
  },
  methods: {
    async getUser() {
      const userParams = {
        id: this.getUserId(),
      };
      this.user = await this.performGetRequest(this.getEnvVariable('USERS_BASE_ENDPOINT'), 'get_user', userParams);
    },
    getImgUrl(imgName) {
      const images = require.context('../assets/profile_pics', false, /\.png$/);
      return images(`./${imgName}.png`);
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
</style>
