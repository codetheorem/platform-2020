<template>
  <div id="home-page">
    <countdown class="countdown" :time=countdownTime>
      <template slot-scope="props">
        <div>
          Time left to submit my hack:
        </div>
        <div style="font-weight: bold;">
          {{ props.days }}d:{{ props.hours }}h:{{ props.minutes }}m
        </div>
      </template>
    </countdown>
    <h2 class="page-header animate__animated animate__fadeInUp">Welcome, {{ getUserName() }}</h2>
    <div class="home-header animate__animated animate__fadeInUp delay1">
      <div v-if="getUserGroup() === 'sponsor'" class="sponsor-buttons">
        <Button text="Chat with an Organizer" @click="openIntercom()" class="sponsor-button"/>
        <router-link :to="'/sponsor-analytics?id=' + getSponsorBoothId()"><Button text="My Sponsor Booth" class="sponsor-button"/></router-link>
        <Button text="View Project Submissions" class="sponsor-button"/>
      </div>
      <div class="home-main">
        <div class="home-links">
          <h5>HELPFUL LINKS</h5>
          <p>Welcome to the Technica platform! We're incredibly excited to host you and the entire Technica community for an amazing weekend of learning, inclusiveness, and fun.</p>
          <a id="onboardingWalkthroughButton" href="#" class="home-link" @click="initiateOnboardingWalkthrough"><p>Learn About the Technica Platform</p></a>
          <a href="https://slack.com" target="_blank" class="home-link"><p>Join the Conversation on Slack</p></a>
          <router-link to="/resources"><a href="#" class="home-link"><p>Useful Resources for Your Hack</p></a></router-link>
          <router-link to="/help"><a href="#" class="home-link"><p>Get In Touch With a Representative</p></a></router-link>
        </div>
        <div class="home-announcements">
          <h5>ANNOUNCEMENTS</h5>
          <div class="announcements-list">
            <Banner v-if="dataLoaded" v-for="announcement in announcements" :text="announcement.text" :key="announcement.id"/>
            <LoadingSpinner v-else />
          </div>
        </div>
      </div>
    </div>
    <div class="home-footer animate__animated animate__fadeInUp delay2">
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
    <div class="cloud-wrapper animate__animated animate__fadeInUp delay3">
      <img src="@/assets/home_page_bg.svg" alt="Two technica hackers getting to know each other" class="cloud-image">
    </div>
  </div>
</template>

<script>
import Banner from '@/components/Banner.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import ScheduleCarousel from '@/components/ScheduleCarousel.vue';
import Vue from 'vue';
import VueCountdown from '@chenfengyuan/vue-countdown';
import Button from '../components/Button.vue';
import generalMixin from '../mixins/general';
import scheduleMixin from '../mixins/schedule';

Vue.component(VueCountdown.name, VueCountdown);

export default {
  name: 'Home',
  components: {
    Banner,
    ScheduleCarousel,
    Button,
    LoadingSpinner,
    VueCountdown,
  },
  mixins: [generalMixin, scheduleMixin],
  methods: {
    initiateOnboardingWalkthrough() {
      // eslint-disable-next-line no-undef
      Intercom('startTour', this.getEnvVariable('PLATFORM_WALKTHROUGH_ID'));
    },
    openIntercom() {
      // eslint-disable-next-line no-undef
      Intercom('show');
    },
    async getAnnouncements() {
      const announcements = await this.performGetRequest(this.getEnvVariable('ADMIN_BASE_ENDPOINT'), 'get_announcements', {});
      const formattedAnnouncements = [];
      Object.keys(announcements).forEach((a) => {
        formattedAnnouncements.push(announcements[a]);
      });
      this.announcements = formattedAnnouncements.sort((a, b) => b.timestamp - a.timestamp); // sort by time
    },
  },
  data() {
    const now = new Date();
    const deadline = new Date(this.getEnvVariable('COUNTDOWN_END_DATETIME'));

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
      startDate: new Date(this.getEnvVariable('START_DATE')),
      endDate: new Date(this.getEnvVariable('END_DATE')),
      announcements: [],
      countdownTime: deadline - now,
    };
  },
  async mounted() {
    this.prepareTimeWindows();
    this.populateDays();
    await this.getAnnouncements();
    await this.getEventsFromUserList();
    this.rawEvents = await this.getData(this.getEnvVariable('SCHEDULE_BASE_ENDPOINT'), 'schedule');
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

.countdown {

  border-radius: 8px;
  filter: drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.25));

  font-family: 'Noto Sans', sans-serif;
  font-size: 20px;

  padding: 20px;
  background: white;
}

h2 {
  color: var(--bright-purple);
}

.home-main {
  display: flex;
  padding: 2rem;
  padding-left: 10rem;
  padding-right: 10rem;
  justify-content: center;
  align-items: stretch;
  width: 100%;
  margin-top: -1rem;
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
  align-items: center;
  flex-direction: column;
  max-height: 30vh;
  overflow-y: scroll;
}

.home-link {
  text-decoration: underline;
  text-decoration-color: #464343;
  color: #2D2D2D;
}

.cloud-wrapper {
  display:flex;
  justify-content: center;
}

.cloud-image {
  max-height: 55vh;
  height: 30vh;
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
.delay1 {
  animation-delay: 200ms;
}

.delay2 {
  animation-delay: 400ms;
}

.delay3 {
  animation-delay: 600ms;
}

.home-footer {
  margin-top: -4rem;
}

.sponsor-button {
  margin-right: 1rem;
}

@media (max-width: 1500px) {
  .home-main {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .home-links {
    margin-right: .5rem;
  }
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

/* on large screens, put countdown timer on right */
@media only screen and (min-width: 1200px) {
  .countdown {
    position: absolute;
    right: 0;
  }
}

</style>
