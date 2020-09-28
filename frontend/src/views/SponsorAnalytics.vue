<template>
  <div class="page-container">
    <div v-if="dataLoaded" class="sponsor-header">
      <div class="back-button-container">
      </div>
      <div class="sponsor-logo">
        <img :src="sponsor.logo_image" />
      </div>
      <!-- header-placeholder exists so we can have the logo and back button left and center aligned properly -->
      <div class="header-placeholder"></div>
    </div>
    <div v-if="dataLoaded" class="sponsor-body">
      <div class="sponsor-body-left">
        <div class="sponsor-stat" style="margin-top: 5rem;">
          <div class="sponsor-stat-title">
            Total Page Views
          </div>
          <div class="sponsor-stat-body">
            120
          </div>
        </div>
        <div class="sponsor-stat" style="margin-top: 5rem;">
          <div class="sponsor-stat-title" >
            Total Page Views
          </div>
          <div class="sponsor-stat-body" >
            214
          </div>
        </div>
        <div class="sponsor-stat" style="margin-top: -5rem;">
          <div class="sponsor-stat-title">
            Total Unique Viewers
          </div>
          <div class="sponsor-stat-body">
            86
          </div>
        </div>
        <div class="sponsor-stat" style="margin-top: -5rem;">
          <div class="sponsor-stat-title">
            Total Booth Asset Downloads
          </div>
          <div class="sponsor-stat-body">
            29
          </div>
        </div>
      </div>
      <div class="sponsor-body-right">
        <div class="sponsor-info-card">
          <div class="sponsor-info-title">
            Virtual Booth Settings
          </div>
          <Button size="sm" :text="toggleBoothText" @click="toggleBoothOpenState()" />
          <a :href="sponsor.main_video_session" target="_blank"><Button size="sm" text="Join Call" /></a>
          <router-link :to="'/sponsor?id=' + sponsorId"><Button size="sm" text="View Live Booth" /></router-link>
        </div>
        <div class="sponsor-info-card">
          <div class="sponsor-info-title">
            View Appointments
          </div>
          <div class="sponsor-info-list">
            <a :href="sponsor.one_on_one_link" target="_blank"><Button size="sm" text="One on One" /></a>
            <a :href="sponsor.small_group_link" target="_blank"><Button size="sm" text="Small Group" /></a>
          </div>
        </div>
        <div class="sponsor-info-card">
          <div class="sponsor-info-title">
            Hacker Profiles
          </div>
          <div class="sponsor-info-list">
            <Button size="sm" text="View Hacker Profiles" />
          </div>
        </div>
      </div>
    </div>
    <LoadingSpinner v-else />
  </div>
</template>

<script>
import Button from '../components/Button.vue';
import LoadingSpinner from '../components/LoadingSpinner.vue';
import generalMixin from '../mixins/general';
import Config from '../config/general';

export default {
  name: 'SponsorBooth',
  components: {
    Button,
    LoadingSpinner,
  },
  mixins: [generalMixin],
  async mounted() {
    window.scrollTo(0, 0);
    this.sponsorId = this.$route.query.id;
    console.log(this.sponsorId);
    if (!this.sponsorId) {
      this.$router.push('/sponsors');
    }
    const env = this.getCurrentEnvironment();
    const params = {
      id: this.sponsorId,
    };
    const sponsorData = await this.performGetRequest(Config[env].ADMIN_BASE_ENDPOINT, env, 'get_sponsor_booth', params);
    if (sponsorData.Items && sponsorData.Items.length > 0) {
      // eslint-disable-next-line prefer-destructuring
      this.sponsor = sponsorData.Items[0];
    } else {
      this.$router.push('/sponsors');
    }
    console.log(this.sponsor)
    this.dataLoaded = true;
  },
  data() {
    return {
      sponsorDescription: 'Major League Hacking (MLH) is the official student hackathon league. Each year, we power over 200 weekend-long invention competitions that inspire innovation, cultivate communities and teach computer science skills to more than 65,000 students around the world. <br /><br />MLH has been a community first, mission driven organization from the beginning. We measure our success by the number of hackers we empower, and we want to keep it that way. <br /><br />Have a question about MLH? Head over to our FAQ to find some answers to common questions.',
      slide: 0,
      sliding: null,
      sponsorId: null,
      dataLoaded: false,
      sponsor: null,
      boothOpen: false,
    };
  },
  methods: {
    onSlideStart() {
      this.sliding = true;
    },
    onSlideEnd() {
      this.sliding = false;
    },
    toggleBoothOpenState() {
      this.boothOpen = !this.boothOpen;
    },
  },
  computed: {
    toggleBoothText() {
      return this.boothOpen ? 'Close Booth' : 'Open Booth';
    },
  },
};
</script>

<style scoped>
.page-container {
  display: flex;
  justify-content: center;
  flex-direction: row;
  flex-wrap: wrap;
}

.sponsor-header {
  /* border: 1px solid red; */
  margin-top: 1rem;
  height: 10vh;
  width: 80vw;
  display: flex;
  justify-content: space-between;
  align-content: center;
  margin-bottom: 2rem;
}

.sponsor-body {
  /* border: 1px solid green; */
  height: 80vh;
  width: 80vw;
}

.sponsor-footer {
  /* border: 1px solid blue; */
  height: 30vh;
  width: 80vw;
  margin-top: 0rem;
}

.back-button-container {
  /* border: 1px solid red; */
  display: flex;
  justify-content: center;
  align-items: center;
}

.sponsor-logo {
  /* border: 1px solid red; */
}

.header-placeholder {
  width: 10%;
  height: 100%;
  opacity: 0;
}

.sponsor-body {
  display: flex;
  justify-content: center;
  align-items: center;
}

.sponsor-body-left {
  display: flex;
  width: 70%;
  min-height: 100%;
  height: fit-content;
  /* border: 1px solid purple; */
  flex-direction: row;
  /* justify-content: center; */
  flex-wrap: wrap;
}

.sponsor-body-right {
  display: flex;
  width: 30%;
  height: 100%;
  /* border: 1px solid black; */
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
}

.sponsor-description {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: fit-content;
  min-height: 40%;
  width: 100%;
  /* border: 1px solid green; */
  padding-left: 5rem;
  padding-right: 5rem;
  margin-bottom: 2rem;
}

.sponsor-images {
  height: 100%;
  width: 70%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.sponsor-info-card {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
}

.sponsor-info-title {
  font-family: Noto Sans;
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 24px;
  text-align: center;
  color: #000000;
  opacity: 0.8;
  border-bottom: 4px solid #B377DB;
  width: fit-content;
  margin-bottom: .5rem;
  margin-top: 3rem;
}

.sponsor-footer-inner {
  width: 90%;
  height: 100%;
  margin-left: 4rem;
}

.sponsor-info-list {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.sponsor-footer-row-a {
  width: 100%;
  height: 25%;
  /* border: 1px solid green; */
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 1rem;
}

.sponsor-footer-row-b {
  width: 100%;
  height: 75%;
  /* border: 1px solid red; */
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  /* margin-bottom: 5rem; */
}

.sponsor-posting-card {
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: #FFFFFF;
  border: 1px solid var(--pastel-purple);
  box-sizing: border-box;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
}

.posting-list {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 80%;
}

.posting-title {
  font-family: Noto Sans;
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 22px;
  color: #EA668E;
  margin-bottom: .5rem;
}

.sponsor-stat {
  width: 50%;
  height: 10%;
}

.sponsor-stat-title {
  font-family: Noto Sans;
  font-style: normal;
  font-weight: normal;
  font-size: 35px;
  line-height: 36px;
  text-align: center;
  color: #000000;
}

.sponsor-stat-body {
  font-family: DIN Pro;
  font-style: normal;
  font-weight: 500;
  font-size: 66px;
  line-height: 66px;
  text-align: center;
  color: #000000;
}
</style>
