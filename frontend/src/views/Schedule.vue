<template>
  <div class="schedule-page">
    <h2 class="page-header">Events</h2>
    <div class="schedule-list">
      <div class="schedule-list-title">
        <span v-for="day in days" :key="day" class="schedule-list-title-item" :class="{'schedule-list-title-item-selected': day === selectedDay}" @click="selectTitleItem(day)">{{ day.toUpperCase() }}</span>
      </div>
      <div id="schedule-body" class="schedule-body">
        <div class="time-container">
          <span v-for="time in times" :key="time" class="time-item">
            <span style="display: inline-block; width: 5px;">{{ time }}</span>
          </span>
        </div>
        <a href="https://zoom.us/j/75125004086" target="_blank" style="cursor: normal;">
          <div class="event-container" v-if="selectedDay === 'Saturday'">
            <div class="event-line">
              <span class="event-item event-90"><img src="@/assets/Star.png" style="padding-right: 10px;"/>Midnight Meetup</span>
              <span class="event-item event-120" style="margin-left: 40px;"><img src="@/assets/Star.png" style="padding-right: 10px;"/>Animal Jam Party</span>
              <span class="event-item event-60" style="margin-left: 430px;"><img src="@/assets/Star_purple_outline.png" style="padding-right: 10px;"/>Breakfast</span>
              <span class="event-item event-90" style="margin-left: 100px;"><img src="@/assets/Star.png" style="padding-right: 10px;"/>Workshop with Atlassian</span>
            </div>
            <div class="event-line">
              <span class="event-item event-120" style="margin-left: 40px; margin-left: 100px;"><img src="@/assets/Star.png" style="padding-right: 10px;"/>Animal Jam Party</span>
              <span class="event-item event-90"><img src="@/assets/Star.png" style="padding-right: 10px;"/>Cup Stacking</span>
              <span class="event-item event-90" style="margin-left: 230px;"><img src="@/assets/Star.png" style="padding-right: 10px;"/>Team Snack!</span>
              <span class="event-item event-60" style="margin-left: 430px;"><img src="@/assets/Star_purple_outline.png" style="padding-right: 10px;"/>Lunch</span>
              <span class="event-item event-120" style="margin-left: 200px;"><img src="@/assets/Star.png" style="padding-right: 10px;"/>Animal Jam Party</span>
            </div>
            <div class="event-line">
              <span class="event-item event-90" style="margin-left: 100px;"><img src="@/assets/Star.png" style="padding-right: 10px;"/>Animal Jam Party</span>
              <span class="event-item event-60" style="margin-left: 230px;"><img src="@/assets/Star_purple_outline.png" style="padding-right: 10px;"/>Cup Stacking</span>
              <span class="event-item event-90"><img src="@/assets/Star.png" style="padding-right: 10px;"/>Cup Stacking</span>
              <span class="event-item event-120" style="margin-left: 40px;"><img src="@/assets/Star.png" style="padding-right: 10px;"/>Animal Jam Party</span>
              <span class="event-item event-90" style="margin-left: 100px;"><img src="@/assets/Star.png" style="padding-right: 10px;"/>Uber Techni-Chat</span>
              <span class="event-item event-60" style="margin-left: 430px;"><img src="@/assets/Star_purple_outline.png" style="padding-right: 10px;"/>Cup Stacking</span>
            </div>
            <div class="event-line">
              <span class="event-item event-90" style="margin-left: 600px;"><img src="@/assets/Star.png" style="padding-right: 10px;"/>Workshop with Google</span>
              <span class="event-item event-60" style="margin-left: 230px;"><img src="@/assets/Star_purple_outline.png" style="padding-right: 10px;"/>LGBTQ Meetup</span>
            </div>
          </div>
          <div class="event-container" v-else>
            <div class="event-line">
              <span class="event-item event-120" style="margin-left: 40px; margin-left: 100px;"><img src="@/assets/Star.png" style="padding-right: 10px;"/>Animal Jam Party</span>
              <span class="event-item event-90"><img src="@/assets/Star.png" style="padding-right: 10px;"/>Cup Stacking</span>
              <span class="event-item event-90" style="margin-left: 230px;"><img src="@/assets/Star.png" style="padding-right: 10px;"/>Team Snack!</span>
              <span class="event-item event-60" style="margin-left: 430px;"><img src="@/assets/Star_purple_outline.png" style="padding-right: 10px;"/>Lunch</span>
              <span class="event-item event-120" style="margin-left: 200px;"><img src="@/assets/Star.png" style="padding-right: 10px;"/>Animal Jam Party</span>
            </div>
            <div class="event-line">
              <span class="event-item event-90" style="margin-left: 100px;"><img src="@/assets/Star.png" style="padding-right: 10px;"/>Animal Jam Party</span>
              <span class="event-item event-60" style="margin-left: 230px;"><img src="@/assets/Star_purple_outline.png" style="padding-right: 10px;"/>Cup Stacking</span>
              <span class="event-item event-90"><img src="@/assets/Star.png" style="padding-right: 10px;"/>Cup Stacking</span>
              <span class="event-item event-120" style="margin-left: 40px;"><img src="@/assets/Star.png" style="padding-right: 10px;"/>Animal Jam Party</span>
              <span class="event-item event-90" style="margin-left: 100px;"><img src="@/assets/Star.png" style="padding-right: 10px;"/>Uber Techni-Chat</span>
            </div>
            <div class="event-line">
              <span class="event-item event-90" style="margin-left: 600px;"><img src="@/assets/Star.png" style="padding-right: 10px;"/>Workshop with Google</span>
              <span class="event-item event-60" style="margin-left: 230px;"><img src="@/assets/Star_purple_outline.png" style="padding-right: 10px;"/>LGBTQ Meetup</span>
              <span class="event-item event-120" style="margin-left: 400px;"><img src="@/assets/Star.png" style="padding-right: 10px;"/>Techni-Chat with Lyft</span>
            </div>
            <div class="event-line">
              <span class="event-item event-90"><img src="@/assets/Star.png" style="padding-right: 10px;"/>Midnight Meetup</span>
              <span class="event-item event-120" style="margin-left: 40px;"><img src="@/assets/Star.png" style="padding-right: 10px;"/>Animal Jam Party</span>
              <span class="event-item event-60" style="margin-left: 430px;"><img src="@/assets/Star_purple_outline.png" style="padding-right: 10px;"/>Breakfast</span>
              <span class="event-item event-90" style="margin-left: 100px;"><img src="@/assets/Star.png" style="padding-right: 10px;"/>Workshop with Atlassian</span>
            </div>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import generalMixin from '../mixins/general';
import Config from '../config/general';

export default {
  name: 'Schedule',
  mixins: [generalMixin],
  data() {
    return {
      events: [],
      selectedDay: 'Saturday',
      days: ['Saturday', 'Sunday'],
      times: ['12 AM', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM'],
    };
  },
  async mounted() {
    console.log(process.env.NODE_ENV);
    await this.activityTracking();
    const env = this.getCurrentEnvironment();
    this.events = await this.getData(Config[env].SCHEDULE_BASE_ENDPOINT, env, 'schedule');
    console.log(this.schedule);
  },
  methods: {
    getFormattedTime(rawDateTime) {
      return (new Date(rawDateTime)).toTimeString();
    },
    selectTitleItem(day) {
      this.selectedDay = day;
    },
    async activityTracking() {
      const env = this.getCurrentEnvironment();
      const params = {
        user_id: this.getUserId(),
        action: "SCHEDULE",
      };
      await this.performPostRequest(Config[env].USERS_BASE_ENDPOINT, env, 'track_user_activity', params);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.schedule-page {
  display: flex;
  align-items: center;
  flex-direction: column;
}

h2 {
  color: var(--bright-purple);
}

.schedule-list {

}

.schedule-list-title-item {
  background: #FFFFFF;
  box-sizing: border-box;
  border-radius: 4px 0px 0px 4px;
  padding: 10px;
  font-family: DINPro;
  font-style: normal;
  font-weight: 300;
  font-size: 24px;
  margin-right: 3px;
  border: 5px solid #DED2E6;
  color: #B6A1C4;
  cursor: pointer;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

.schedule-list-title-item-selected {
  border: 4px solid #B377DB;
  box-shadow: 0px 4px 4px rgba(179, 119, 219, 0.25);
  color: #B377DB;
}

.schedule-body {
  margin-top: 2rem;
  background: #FFFFFF;
  border-radius: 8px;
  height: 50vh;
  width: 80vw;
  white-space: nowrap;
  overflow-x: auto;
  padding: 1rem;
}

.time-container {
}

.time-item {
  /* border: 1px solid blue; */
  padding-right: 5rem;
  height: fit-content;
  font-family: Noto Sans;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 22px;
  color: #A88AA8;
  padding-left: 1rem;
}

.event-container {
  padding-left: 1rem;
  cursor: default;
}

.event-item {
  background: #A88AA8;
  border-radius: 8px;
  min-width: fit-content;
  width: 150px;
  padding: 10px;
  padding-top: 15px;
  padding-bottom: 15px;
  margin-top: 1rem;
  margin-bottom: 1rem;
  font-family: Noto Sans;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  color: #FFFFFF;
  margin-right: 10px;
}

.event-hour {

}

.event-90 {
  width: 190px;
}

.event-120 {
  width: 240px;
  background: #B377DB;
}

.event-60 {
  width: 120px;
  background: #DED2E5;
  color: #B377DB;
}

.event-line {
  width: 100%;
  height: fit-content;
  display: flex;
  flex-flow: row;
}

.event-item:hover {
  box-shadow: 0px 3px 2px rgba(0, 0, 0, 0.15) !important;
  cursor: pointer;
}
</style>
