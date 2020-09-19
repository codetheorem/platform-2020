<template>
  <div class="schedule-page">
    <h2 class="page-header">Events</h2>
    <div class="schedule-list">
      <div class="schedule-list-title">
        <span v-for="day in days" :key="day" class="schedule-list-title-item" :class="{'schedule-list-title-item-selected': day === selectedDay}" @click="selectTitleItem(day)">{{ day.toUpperCase() }}</span>
      </div>
      <div id="schedule-body" class="schedule-body">
        <div class="schedule-time">
          <div v-for="timeWindow in timeWindows" :key="timeWindow" class="timewindow">
            {{ timeWindow }}
          </div>
        </div>
        <div class="schedule-content">
          <div v-for="scheduleColumn in scheduleColumns" :key="scheduleColumn" class="schedule-column">
              <div v-for="timeWindow in timeWindows" :key="timeWindow" class="timewindow">
                <div class="schedule-content-item">{{ timeWindow }}</div>
              </div>
          </div>
        </div>
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
      timeWindows: [],
      scheduleColumns: 3,
    };
  },
  async mounted() {
    this.prepareTimeWindows();
    const env = this.getCurrentEnvironment();
    this.events = await this.getData(Config[env].SCHEDULE_BASE_ENDPOINT, env, 'schedule');
    console.log(this.events);
    await this.activityTracking('SCHEDULE');
  },
  methods: {
    getFormattedTime(rawDateTime) {
      return (new Date(rawDateTime)).toTimeString();
    },
    selectTitleItem(day) {
      this.selectedDay = day;
    },
    prepareTimeWindows() {
      this.timeWindows.push('12AM');
      for (let i = 1; i < 12; i += 1) {
        this.timeWindows.push(`${i}AM`);
      }
      this.timeWindows.push('12PM');
      for (let i = 1; i < 12; i += 1) {
        this.timeWindows.push(`${i}PM`);
      }
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
  height: fit-content;
  width: 70vw;
  display: flex;
  justify-content: flex-start;
  border: 1px solid green;
}

.schedule-time {
  display: flex;
  flex-flow: column;
  width: 10%;
}

.schedule-content {
  display: flex;
  width: 90%;
  flex-direction: row;
  flex-wrap: wrap;
}

.timewindow {
  border: 1px solid blue;
  height: 5vh;
  width: 100%;
}

.schedule-column {
  flex-grow: 1;
  flex-wrap: wrap;
}

.schedule-content-item {
  flex: 0 0 30%;
  border: 1px solid green;
  height: 100%;
}
</style>
