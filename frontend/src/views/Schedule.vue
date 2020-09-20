<template>
  <div class="schedule-page">
    <h2 class="page-header">Events</h2>
    <div v-if="dataLoaded" class="schedule-list">
      <div class="schedule-list-title">
        <span v-for="day in days" :key="getDayOfTheWeek(day)" class="schedule-list-title-item" :class="{'schedule-list-title-item-selected': day === selectedDay}" @click="selectTitleItem(day)">{{ getDayOfTheWeek(day).toUpperCase() }}</span>
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
                <div v-if="formattedEvents[selectedDay][timeWindow].length >= scheduleColumn" class="schedule-content-item" :class="formattedEvents[selectedDay][timeWindow][scheduleColumn - 1].branding.class">
                  <div class="schedule-content-item-star">
                    <img :src="getImgUrl(formattedEvents[selectedDay][timeWindow][scheduleColumn - 1])" />
                  </div>
                  <div class="schedule-content-item-title">
                    {{ formattedEvents[selectedDay][timeWindow][scheduleColumn - 1].event_name }}
                  </div>
                </div>
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

const startDate = new Date(Config.shared.START_DATE);
const endDate = new Date(Config.shared.END_DATE);

const eventBrandingTypes = [{ class: 'content-item-type-a', emptyStarImgName: 'star_purple_empty', filledStarImgName: 'star_purple_filled' }, { class: 'content-item-type-b', emptyStarImgName: 'star_white_empty', filledStarImgName: 'star_white_filled' }, { class: 'content-item-type-c', emptyStarImgName: 'star_white_empty', filledStarImgName: 'star_white_filled' }];

export default {
  name: 'Schedule',
  mixins: [generalMixin],
  data() {
    return {
      rawEvents: [],
      formattedEvents: {},
      selectedDay: null,
      days: [],
      timeWindows: [],
      scheduleColumns: 3,
      dataLoaded: false,
    };
  },
  async mounted() {
    this.prepareTimeWindows();
    this.populateDays();
    const env = this.getCurrentEnvironment();
    this.rawEvents = await this.getData(Config[env].SCHEDULE_BASE_ENDPOINT, env, 'schedule');
    console.log(this.rawEvents);
    this.processRawEvents();
    this.dataLoaded = true;
    await this.activityTracking('SCHEDULE');
  },
  methods: {
    getFormattedTime(rawDateTime) {
      return (new Date(rawDateTime)).toTimeString();
    },
    selectTitleItem(day) {
      this.selectedDay = day;
    },
    populateDays() {
      let currentDate = new Date(startDate.setDate(startDate.getDate() - 1));
      console.log(currentDate)
      while ((currentDate - endDate) !== 0) {
        this.days.push(currentDate);
        currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
      }
      console.log(this.days)
      // eslint-disable-next-line prefer-destructuring
      this.selectedDay = this.days[0];
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
    processRawEvents() {
      for (let i = 0; i < this.rawEvents.length; i += 1) {
        this.rawEvents[i].branding = eventBrandingTypes[i % 3];
      }
      this.days.forEach((day) => {
        this.formattedEvents[day] = {};
        this.timeWindows.forEach((timeWindow) => {
          this.formattedEvents[day][timeWindow] = this.getEventsForTimeWindow(timeWindow, day);
        });
      });
      console.log(this.formattedEvents);
    },
    convertTimeWindowTo24HourFormat(timeWindow) {
      if (timeWindow.includes('AM')) {
        return parseInt(timeWindow.replace(/[^0-9]/g, ''), 10);
      }
      return parseInt(timeWindow.replace(/[^0-9]/g, ''), 10) + 12;
    },
    getEventsForTimeWindow(timeWindow, day) {
      return this.rawEvents.filter((rawEvent) => {
        const rawEventStart = (new Date(rawEvent.start_time));
        return rawEventStart.getHours() === this.convertTimeWindowTo24HourFormat(timeWindow) && rawEventStart.getDate() === day.getDate();
      });
    },
    getImgUrl(event) {
      const images = require.context('../assets', false, /\.png$/);
      return images(`./${event.branding.emptyStarImgName}.png`);
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
  /* border: 1px solid blue; */
  height: 5vh;
  width: 100%;
}

.schedule-column {
  flex-grow: 1;
  flex-wrap: wrap;
  margin-right: 1rem;
}

.schedule-content-item {
  height: 90%;
  border-radius: 8px;
  font-family: Noto Sans;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: fit-content;
}

.content-item-type-a {
  color: #B377DB;
  background: #DED2E5;
}

.content-item-type-b {
  background: #A88AA8;
  border-radius: 8px;
  color: #FFFFFF;
}

.content-item-type-c {
  background: #B377DB;
  border-radius: 8px;
  color: #FFFFFF;
}

.schedule-content-item-star {
  width: fit-content;
  margin-left: .5rem;
}

.schedule-content-item-title {
  flex-grow: 1;
  text-align: start;
  padding-left: 1rem;
  margin-right: 2rem;
}
</style>
