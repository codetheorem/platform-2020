<template>
  <div class="page-container">
    <div class="sponsor-header">
      <div class="back-button-container">
        <Button size="lg" text="Back to Sponsor List" :outlineStyle="true" :backArrow="true" />
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
        </div>
      </div>
      <div class="sponsor-body-right">
      </div>
    </div>
    <div class="sponsor-footer">
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
  data() {
    return {
      sponsorDescription: 'Major League Hacking (MLH) is the official student hackathon league. Each year, we power over 200 weekend-long invention competitions that inspire innovation, cultivate communities and teach computer science skills to more than 65,000 students around the world. <br /><br />MLH has been a community first, mission driven organization from the beginning. We measure our success by the number of hackers we empower, and we want to keep it that way. <br /><br />Have a question about MLH? Head over to our FAQ to find some answers to common questions.'
    };
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
  border: 1px solid red;
  height: 10vh;
  width: 80vw;
  display: flex;
  justify-content: space-between;
  align-content: center;
}

.sponsor-body {
  border: 1px solid green;
  height: 60vh;
  width: 80vw;
}

.sponsor-footer {
  border: 1px solid blue;
  height: 20vh;
  width: 80vw;
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
  height: 100%;
  border: 1px solid purple;
}

.sponsor-body-right {
  display: flex;
  width: 30%;
  height: 100%;
  border: 1px solid black;
}

.sponsor-description {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: fit-content;
  min-height: 40%;
  width: 100%;
  border: 1px solid green;
  padding-left: 5rem;
  padding-right: 5rem;
}
</style>
