<template>
  <div class="schedule-page">
    <div>
      <h2 style="padding-top: 1rem;">Events</h2>
    </div>
    <div class="event-carousel">
      <h4 style="margin-top: 1rem;">BEGINNER TRACK</h4>
      <div class="carousel-inner">
        <div class="event-container" v-for="(event, id) in events" :key="id">
          <div class="event-title">{{ event.title }}</div>
          <div>{{ event.description }}</div>
          <div>10:30 pm - 11:30 pm Sunday</div>
          <Button size="sm" text="More Info" @click="viewEvent()" class="create-team-button" style="background: #EA668E !important; border: 2px solid #EA668E !important; margin-top: .5rem; margin-left: 0rem;"/>
          <Button size="sm" text="Cancel" @click="viewEvent()" class="create-team-button" style="margin-top: .5rem; margin-left: 1rem;"/>
        </div>
      </div>
    </div>
    <table id="schedule-table">
      <tr>
        <th>Name</th>
        <th>Category</th>
        <th>Description</th>
        <th>Start Time</th>
      </tr>
      <tr v-for="event in events" :key="event.id" class="schedule-item">
        <td>{{ event.title }}</td>
        <td>{{ event.category}}</td>
        <td>{{ event.description}}</td>
        <td>10:30 pm - 11:30 pm Sunday</td>
      </tr>
    </table>
  </div>
</template>

<script>
import Button from '@/components/Button.vue';
import generalMixin from '../mixins/general';
import Config from '../config/general';

export default {
  name: 'Schedule',
  props: {
    msg: String,
  },
  components: { Button },
  mixins: [generalMixin],
  data() {
    return {
      events: [],
    };
  },
  async mounted() {
    console.log(process.env.NODE_ENV);
    const env = this.getCurrentEnvironment();
    this.events = await this.getData(Config[env].SCHEDULE_BASE_ENDPOINT, env, 'schedule');
    console.log(this.schedule);
  },
  methods: {
    getFormattedTime(rawDateTime) {
      return (new Date(rawDateTime)).toTimeString();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.schedule-page {
  background-color: #F6F4F7;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  flex-direction: column;
}

h2 {
  color: var(--bright-purple);
}

.event-carousel {
  background: #FFFFFF;
  border-radius: 8px;
  width: 80%;
  height: 30%;
}

.event-container {
  background: #DED2E5;
  border-radius: 12px;
  width: 25%;
  height: 60%;
  display:inline-block;
  margin: 2rem;
  padding: 1rem;
}

.carousel-inner {
  height: 70%;
}

.event-title {
  font-family: Noto Sans;
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 20px;
  color: #000000;
}

.schedule-item {
  padding: 10px;
  border: 1px solid var(--pastel-purple);
}
#schedule-table {
  margin: 0 auto;
  margin-top: 2rem;
}
td, th {
  border: 1px solid var(--pastel-purple);
  padding: 10px;
}
</style>
