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
            <div v-if="timeWindow === getScheduleTimeLineWindow && 6 === selectedDay.getDay()" class="schedule-time-line">
              <div class="schedule-time-line-header">
              </div>
              <div class="schedule-time-line-inner">
              </div>
            </div>
          </div>
        </div>
        <div class="schedule-content">
          <div v-for="scheduleColumn in scheduleColumns" :key="scheduleColumn" class="schedule-column">
              <div v-for="timeWindow in timeWindows" :key="timeWindow" class="timewindow">
                <div v-if="formattedEvents[selectedDay][timeWindow].find(event => event.column === scheduleColumn)" @click="openScheduleModal(selectedDay, timeWindow, scheduleColumn)" class="schedule-content-item" :class="formattedEvents[selectedDay][timeWindow].find(event => event.column === scheduleColumn).branding.class">
                  <div class="schedule-content-item-star">
                    <img
                      :src="getImgUrl(formattedEvents[selectedDay][timeWindow].find(event => event.column === scheduleColumn))"
                      @click.stop="toggleAddingEventToList(formattedEvents[selectedDay][timeWindow].find(event => event.column === scheduleColumn))"
                      style="width: 19px; height: 18px;"
                    />
                  </div>
                  <div class="schedule-content-item-title">
                    {{ formattedEvents[selectedDay][timeWindow].find(event => event.column === scheduleColumn).event_name }}
                  </div>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
    <LoadingSpinner v-else />
    <b-modal id="scheduleEventModal" :title="selectedEvent.event_name" size="md" centered>
      <p><b>{{ getTimeDescriptionForEvent(selectedEvent) }}</b></p>
      <p>{{ selectedEvent.description }}</p>
      <template v-slot:modal-footer>
          <Button v-if="!selectedEvent.addedToUserList" text="Add to List" @click="addSelectedEventToList()" :outlineStyle="true" size="sm"/>
          <Button v-if="selectedEvent.addedToUserList" text="Remove from List" @click="addSelectedEventToList()" :outlineStyle="true" size="sm"/>
          <Button text="Attend" @click="attendEvent()" size="sm"/>
      </template>
    </b-modal>
  </div>
</template>

<script>
import generalMixin from '../mixins/general';
import Config from '../config/general';
import Button from '../components/Button.vue';
import LoadingSpinner from '../components/LoadingSpinner.vue';

const eventBrandingTypes = [{ class: 'content-item-type-a', emptyStarImgName: 'star_purple_empty', filledStarImgName: 'star_purple_filled' }, { class: 'content-item-type-b', emptyStarImgName: 'star_white_empty', filledStarImgName: 'star_white_filled' }, { class: 'content-item-type-c', emptyStarImgName: 'star_white_empty', filledStarImgName: 'star_white_filled' }];

export default {
  name: 'Schedule',
  mixins: [generalMixin],
  components: {
    Button,
    LoadingSpinner,
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
    attendEvent() {
      window.open(this.selectedEvent.link, '_blank');
    },
    getTimeDescriptionForEvent(event) {
      if (event.start_time) {
        const start = new Date(event.start_time);
        const end = new Date(event.end_time);
        return `${this.formatAMPM(start)} - ${this.formatAMPM(end)} ${this.getDayOfTheWeek(start)}`;
      }
      return '';
    },
    openScheduleModal(selectedDay, timeWindow, scheduleColumn) {
      this.selectedEvent = this.formattedEvents[selectedDay][timeWindow].find((event) => event.column === scheduleColumn);
      this.selectedEvent.selectedDay = selectedDay;
      this.selectedEvent.timeWindow = timeWindow;
      this.selectedEvent.scheduleColumn = scheduleColumn;
      this.$bvModal.show('scheduleEventModal');
    },
    addSelectedEventToList() {
      this.$bvModal.hide('scheduleEventModal');
      this.toggleAddingEventToList(this.formattedEvents[this.selectedEvent.selectedDay][this.selectedEvent.timeWindow].find((event) => event.column === this.selectedEvent.scheduleColumn));
    },
    populateDays() {
      let currentDate = new Date(this.startDate.setDate(this.startDate.getDate() - 1));
      while ((currentDate - this.endDate) !== 0) {
        this.days.push(currentDate);
        currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
      }
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
        this.rawEvents[i].addedToUserList = false;
        if (this.eventsInUserList.map((event) => event.event_id).includes(this.rawEvents[i].id)) {
          this.rawEvents[i].addedToUserList = true;
          this.rawEvents[i].addedEventId = this.eventsInUserList.find((event) => event.event_id === this.rawEvents[i].id).id;
        }
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
      const eventsForWindow = this.rawEvents.filter((rawEvent) => {
        const rawEventStart = (new Date(rawEvent.start_time));
        return rawEventStart.getHours() === this.convertTimeWindowTo24HourFormat(timeWindow) && rawEventStart.getDate() === day.getDate();
      });

      const previousColumns = [];
      eventsForWindow.forEach((event) => {
        let randomColumn = Math.floor(Math.random() * this.scheduleColumns) + 1;
        while (previousColumns.includes(randomColumn)) {
          randomColumn = Math.floor(Math.random() * this.scheduleColumns) + 1;
        }
        // eslint-disable-next-line no-param-reassign
        event.column = randomColumn;
      });

      return eventsForWindow;
    },
    getImgUrl(event) {
      const images = require.context('../assets', false, /\.png$/);
      const imageType = (event.addedToUserList ? 'filledStarImgName' : 'emptyStarImgName');
      return images(`./${event.branding[imageType]}.png`);
    },
    async toggleAddingEventToList(targetEvent) {
      // eslint-disable-next-line no-param-reassign
      targetEvent.addedToUserList = !targetEvent.addedToUserList;
      this.$forceUpdate();

      const env = this.getCurrentEnvironment();

      if (!this.eventsInUserList.map((event) => event.event_id).includes(targetEvent.id)) {
        const addEventToUserListParams = {
          user_id: this.getUserId(),
          event_id: targetEvent.id,
        };
        const addedId = await this.performPostRequest(Config[env].SCHEDULE_BASE_ENDPOINT, env, 'add_event_to_user_list', addEventToUserListParams);
        // eslint-disable-next-line no-param-reassign
        targetEvent.addedEventId = addedId.id;
        this.eventsInUserList.push({ event_id: targetEvent.id, id: addedId.id });
      } else {
        const removeEventParams = {
          id: targetEvent.addedEventId,
        };
        await this.performPostRequest(Config[env].SCHEDULE_BASE_ENDPOINT, env, 'delete_event_from_user_list', removeEventParams);
      }
    },
    async getEventsFromUserList() {
      const env = this.getCurrentEnvironment();
      const userParams = {
        user_id: this.getUserId(),
      };
      const rawEvents = await this.performGetRequest(Config[env].SCHEDULE_BASE_ENDPOINT, env, 'get_events_from_user_list', userParams);
      this.eventsInUserList = rawEvents.Items;
    },
  },
  computed: {
    getScheduleTimeLineWindow() {
      const d = new Date();
      const hours = d.getHours();
      if (hours > 12) {
        return `${hours - 12}PM`;
      }
      return `${hours}AM`;
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
  font-family: DIN Pro;
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
  height: 5vh;
  width: 100%;
}

@media (max-width: 2000px) {
  .schedule-body {
    width: 90vw;
  }
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
  cursor: pointer;
}

@media (max-width: 1500px) {
  .schedule-column {
    max-width: 30%;
  }

  .timewindow {
    height: 7.5vh;
  }

  .schedule-content-item {
    font-size: 12px !important;
  }
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
  max-width: 80%;
}

.modal-content {
  background: #DED2E6 !important;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25) !important;
  border-radius: 4px !important;
}

.schedule-time-line {
  width: 60vw;
  position: absolute;
  height: 2px;
  margin-left: 1rem;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.schedule-time-line-inner {
  width: 100%;
  border: 1px solid red;
}

.schedule-time-line-header {
  border-radius: 50%;
  padding: 8px;
  background-color: red;
  border: 1px solid red;
}
</style>
