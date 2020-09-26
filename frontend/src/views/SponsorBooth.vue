<template>
  <div class="page-container">
    <div class="sponsor-header">
      <div class="back-button-container">
        <router-link to="/sponsors">
          <Button size="lg" text="Back to Sponsor List" :outlineStyle="true" :backArrow="true" />
        </router-link>
      </div>
      <div class="sponsor-logo">
        <img src="https://technica-brand-assets.s3.amazonaws.com/mlh_logo.png" />
      </div>
      <!-- header-placeholder exists so we can have the logo and back button left and center aligned properly -->
      <div class="header-placeholder"></div>
    </div>
    <div class="sponsor-body">
      <div class="sponsor-body-left">
        <div class="sponsor-description">
          <div class="sponsor-description-title">
            <h4>About Us</h4>
          </div>
          <div class="sponsor-description-body">
            <span v-html="sponsorDescription"></span>
          </div>
        </div>
        <div class="sponsor-images">
          <b-carousel
            id="carousel-1"
            v-model="slide"
            :interval="4000"
            controls
            img-width="615"
            img-height="158"
            indicators
            background="#ababab"
            style="text-shadow: 1px 1px 2px #333;"
            @sliding-start="onSlideStart"
            @sliding-end="onSlideEnd"
          >
            <!-- Slides with image only -->
            <b-carousel-slide img-src="https://technica-brand-assets.s3.amazonaws.com/mlh_stock_photo_3.jpg"  img-width="615px"
            img-height="188px"></b-carousel-slide>
            <b-carousel-slide img-src="https://technica-brand-assets.s3.amazonaws.com/mlh_stock_photo_4.jpg"  img-width="615"
            img-height="188px"></b-carousel-slide>
            <b-carousel-slide img-src="https://technica-brand-assets.s3.amazonaws.com/mlh_stock_photo_5.jpg"  img-width="615px"
            img-height="188px"></b-carousel-slide>
            <b-carousel-slide img-src="https://technica-brand-assets.s3.amazonaws.com/mlh_stock_photo_6.jpg"  img-width="615px"
            img-height="188px"></b-carousel-slide>
          </b-carousel>
        </div>
      </div>
      <div class="sponsor-body-right">
        <div class="sponsor-info-card">
          <div class="sponsor-info-title">
            Speak with Sponsor via Zoom
          </div>
          <Button size="sm" text="Join Meeting" />
        </div>
        <div class="sponsor-info-card">
          <div class="sponsor-info-title">
            Schedule an Appointment
          </div>
          <div class="sponsor-info-list">
            <Button size="sm" text="One on One" />
            <Button size="sm" text="Small Group" />
          </div>
        </div>
        <div class="sponsor-info-card">
          <div class="sponsor-info-title">
            Contact Us
          </div>
          <div class="sponsor-info-list">
            <Button size="sm" text="General Inquiries" />
            <Button size="sm" text="Recruiter Email" />
          </div>
        </div>
        <div class="sponsor-info-card">
          <div class="sponsor-info-title">
            Downloadable Content
          </div>
          <div class="sponsor-info-list">
            <Button size="sm" text="Code of Conduct" :downloadButton="true"/>
            <Button size="sm" text="Organizer Guide" :downloadButton="true"/>
          </div>
        </div>
      </div>
    </div>
    <div class="sponsor-footer">
      <div class="sponsor-footer-inner">
        <div class="sponsor-footer-row-b">
          <h4 style="margin-bottom: 1rem;">Job Postings</h4>
          <div class="posting-list">
            <div class="sponsor-posting-card">
              <span class="posting-title">MLH University Ambassador</span>
              <Button size="sm" text="Apply"/>
            </div>
            <div class="sponsor-posting-card">
              <span class="posting-title">MLH Spring Coach</span>
              <Button size="sm" text="Apply"/>
            </div>
            <div class="sponsor-posting-card">
              <span class="posting-title">MLH University Ambassador</span>
              <Button size="sm" text="Apply"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Button from '@/components/Button.vue';
import generalMixin from '../mixins/general';

export default {
  name: 'SponsorBooth',
  components: {
    Button,
  },
  mixins: [generalMixin],
  mounted() {
    window.scrollTo(0, 0);
  },
  data() {
    return {
      sponsorDescription: 'Major League Hacking (MLH) is the official student hackathon league. Each year, we power over 200 weekend-long invention competitions that inspire innovation, cultivate communities and teach computer science skills to more than 65,000 students around the world. <br /><br />MLH has been a community first, mission driven organization from the beginning. We measure our success by the number of hackers we empower, and we want to keep it that way. <br /><br />Have a question about MLH? Head over to our FAQ to find some answers to common questions.',
      slide: 0,
      sliding: null,
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
  align-items: center;
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
