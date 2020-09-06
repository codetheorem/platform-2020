<template>
  <div class="home-page" id="home-page">
    <div class="home-header">
      <h2>Welcome, {{ getUserName() }}</h2>
    </div>
    <div class="home-main">
      <div class="home-links">
        <h5>HELPFUL LINKS</h5>
        <p>Welcome to the Technica platform! We're incredibly excited to host you and the entire Technica community for an amazing weekend of learning, inclusiveness, and fun.</p>
        <a id="onboardingWalkthroughButton" :href="onboardingWalkthroughLink" class="home-link"><p>Learn About the Technica Platform</p></a>
        <a href="https://slack.com" target="_blank" class="home-link"><p>Join the Conversation on Slack</p></a>
        <a href="https://gotechnica.org/hacker-resources" target="_blank" class="home-link"><p>Useful Resources for Your Hack</p></a>
        <router-link to="/help"><a href="#" class="home-link"><p>Get In Touch With An Organizer</p></a></router-link>
      </div>
      <div class="home-announcements">
        <h5>ANNOUNCEMENTS</h5>
        <div class="announcements-list">
          <Banner text="This is a sample announcement. Welcome to Technica!"/>
          <Banner text="This is a sample announcement. Welcome to Technica!"/>
        </div>
      </div>
    </div>
    <div class="home-footer">

    </div>
  </div>
</template>

<script>
import Banner from '@/components/Banner.vue';
import generalMixin from '../mixins/general';
import Config from '../config/general';

export default {
  name: 'Home',
  components: {
    Banner,
  },
  mixins: [generalMixin],
  computed: {
    onboardingWalkthroughLink() {
      const env = this.getCurrentEnvironment();
      return Config[env].PLATFORM_WALKTHROUGH_LINK;
    },
  },
};
</script>

<style scoped>
.home-page {
  background-color: #F6F4F7;
  width: 100vw;
  height: 100vh;
}

h2 {
  color: var(--bright-purple);
}

.home-header {
  padding-top: 2rem;
}

.home-main {
  display: flex;
  padding: 2rem;
  padding-left: 10rem;
  padding-right: 10rem;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.home-links {
  width: 80%;
  background: #DED2E5;
  border-radius: 8px;
  margin-right: 3rem;
  padding: 1rem;
}

.home-announcements {
  background: #FFFFFF;
  border-radius: 8px;
  width: 80%;
  padding: 1rem;
}

.announcements-list {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.home-link {
  text-decoration: underline;
  text-decoration-color: #464343;
  color: #2D2D2D;
}

  @media (max-width: 800px) {
    .home-main {
      flex-flow: column;
      padding-left: 1rem;
      padding-right: 1rem;
    }

    .home-links {
      margin-bottom: 1rem;
    }
  }

</style>
