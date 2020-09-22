<template>
  <div id="home-page">
    <h2 class="page-header">Welcome, {{ getUserName() }}</h2>
    <div class="home-main">
      <div class="home-links">
        <h5>HELPFUL LINKS</h5>
        <p>Welcome to the Technica platform! We're incredibly excited to host you and the entire Technica community for an amazing weekend of learning, inclusiveness, and fun.</p>
        <a id="onboardingWalkthroughButton" href="#" class="home-link" @click="initiateOnboardingWalkthrough"><p>Learn About the Technica Platform</p></a>
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
      <ScheduleCarousel
        title="SCHEDULE HIGHLIGHTS"
        :selectedEvent="selectedEvent"
        :dataLoaded="dataLoaded"
        :rawEvents="rawEvents.slice(0, 9)"
        @openScheduleModal="openScheduleModalDirect"
      />
    </div>
    <b-modal id="scheduleEventModal" :title="selectedEvent.event_name" size="md" centered>
      <p><b>{{ getTimeDescriptionForEvent(selectedEvent) }}</b></p>
      <p>{{ selectedEvent.description }}</p>
      <template v-slot:modal-footer>
          <Button v-if="!selectedEvent.addedToUserList" text="Add to List" @click="addSelectedEventToList()" :outlineStyle="true" size="sm"/>
          <Button v-if="selectedEvent.addedToUserList" text="Remove from List" @click="addSelectedEventToList()" :outlineStyle="true" size="sm"/>
          <Button text="Attend" @click="attendEvent()" size="sm"/>
      </template>
    </b-modal>
    <div class="cloud-wrapper">
      <img src="@/assets/home_page_bg.svg" alt="Two technica hackers getting to know each other" class="cloud-image">
    </div>
  </div>
</template>

<script>
import Banner from '@/components/Banner.vue';
import ScheduleCarousel from '@/components/ScheduleCarousel.vue';
import Button from '../components/Button.vue';
import generalMixin from '../mixins/general';
import scheduleMixin from '../mixins/schedule';
import Config from '../config/general';

export default {
  name: 'Home',
  components: {
    Banner,
    ScheduleCarousel,
    Button,
  },
  mixins: [generalMixin, scheduleMixin],
  methods: {
    initiateOnboardingWalkthrough() {
      const env = this.getCurrentEnvironment();
      // eslint-disable-next-line no-undef
      Intercom('startTour', Config[env].PLATFORM_WALKTHROUGH_ID);
    },
  },
  data() {
    return {
      rawEvents: [],
      formattedEvents: {},
      eventsInUserList: [],
      selectedDay: null,
      days: [],
      timeWindows: [],
      scheduleColumns: 3,
      dataLoaded: false,
      selectedEvent: {},
      startDate: new Date(Config.shared.START_DATE),
      endDate: new Date(Config.shared.END_DATE),
    };
  },
  async mounted() {
    this.prepareTimeWindows();
    this.populateDays();
    await this.getEventsFromUserList();
    const env = this.getCurrentEnvironment();
    this.rawEvents = await this.getData(Config[env].SCHEDULE_BASE_ENDPOINT, env, 'schedule');
    this.processRawEvents();
    this.dataLoaded = true;
    await this.activityTracking('HOME');
  },
  beforeCreate() {
    document.body.className = 'home';
  },
  beforeDestroy() {
    document.body.className = '';
  },
};
</script>

<style scoped>

h2 {
  color: var(--bright-purple);
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

.cloud-wrapper {
  display:flex;
  justify-content: center;
}

.cloud-image {
  max-height: 55vh;
}

@media (max-width: 800px) {
  .cloud-image {
    max-height: 40vw;
  }
}

@media (max-height: 850px) {
  .cloud-image {
    max-height: 35vh;
  }
}

</style>
