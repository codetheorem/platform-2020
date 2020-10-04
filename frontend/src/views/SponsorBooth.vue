<template>
  <div class="page-container">
    <div v-if="dataLoaded" class="sponsor-header">
      <div class="back-button-container">
        <router-link to="/sponsors">
          <Button size="lg" text="Back to Sponsor List" :outlineStyle="true" :backArrow="true" />
        </router-link>
      </div>
      <div class="sponsor-logo">
        <img :src="sponsor.logo_image" />
      </div>
      <!-- header-placeholder exists so we can have the logo and back button left and center aligned properly -->
      <div class="header-placeholder"></div>
    </div>
    <div v-if="dataLoaded" class="sponsor-body">
      <div class="sponsor-body-left">
        <div class="sponsor-description">
          <div class="sponsor-description-title">
            <h4>{{ sponsor.main_title }}</h4>
          </div>
          <div class="sponsor-description-body">
            <span v-html="sponsor.description"></span>
          </div>
        </div>
        <div class="sponsor-images">
          <b-carousel
            id="carousel-1"
            v-model="slide"
            :interval="7000"
            controls
            img-width="615"
            img-height="158"
            indicators
            background="#ababab"
            style="text-shadow: 1px 1px 2px #333;"
            @sliding-start="onSlideStart"
            @sliding-end="onSlideEnd"
          >
            <b-carousel-slide
              v-for="image in sponsor.images"
              :key="image"
              :img-src="image"
              img-width="615px"
              img-height="188px">
            </b-carousel-slide>
          </b-carousel>
        </div>
      </div>
      <div class="sponsor-body-right">
        <div class="sponsor-info-card">
          <div class="sponsor-info-title">
            Speak with Sponsor via Zoom
          </div>
          <a :href="sponsor.main_video_session" target="_blank"><Button size="sm" text="Join Meeting" /></a>
        </div>
        <div class="sponsor-info-card">
          <div class="sponsor-info-title">
            Schedule an Appointment
          </div>
          <div class="sponsor-info-list">
            <a :href="sponsor.one_on_one_link" target="_blank"><Button size="sm" text="One on One" /></a>
            <a :href="sponsor.small_group_link" target="_blank"><Button size="sm" text="Small Group" /></a>
          </div>
        </div>
        <div class="sponsor-info-card">
          <div class="sponsor-info-title">
            Contact Us
          </div>
          <div class="sponsor-info-list">
            <a :href="sponsor.email_one" target="_blank"><Button size="sm" :text="sponsor.email_one_title" /></a>
            <a :href="sponsor.email_two" target="_blank"><Button size="sm" :text="sponsor.email_two_title" /></a>
          </div>
        </div>
        <div class="sponsor-info-card">
          <div class="sponsor-info-title">
            Downloadable Content
          </div>
          <div class="sponsor-info-list">
            <span v-for="item in sponsor.downloadable_content" :key="item.link">
              <a :href="item.link" target="_blank">
                <Button size="sm" :text="item.title" :downloadButton="true"/>
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="dataLoaded" class="sponsor-footer">
      <div class="sponsor-footer-inner">
        <div class="sponsor-footer-row-b">
          <h4 style="margin-bottom: 1rem;"> {{ sponsor.footer_title }}</h4>
          <div class="posting-list">
            <div v-for="footerItem in sponsor.footer_links" class="sponsor-posting-card" :key="footerItem.link">
              <span class="posting-title">{{ footerItem.title }}</span>
              <a :href="footerItem.link" target="_blank"><Button size="sm" text="Apply"/></a>
            </div>
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
    };
  },
  methods: {
    onSlideStart() {
      this.sliding = true;
    },
    onSlideEnd() {
      this.sliding = false;
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
  height: fit-content;
  /* align-items: center; */
}

.sponsor-body-left {
  display: flex;
  width: 70%;
  min-height: 100%;
  height: fit-content;
  /* border: 1px solid purple; */
  flex-direction: column;
  justify-content: center;
  align-items: center;
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
  margin-right: 1rem;
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
</style>
