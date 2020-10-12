<template>
  <div class="schedule-page">
    <h2 class="page-header">Events</h2>
    <div v-if="dataLoaded" class="schedule-list">
      <ScheduleCarousel
        title="MY SAVED EVENTS"
        style="margin-top: -5rem;"
        :useSavedEvents="true"
        :selectedEvent="selectedEvent"
        :dataLoaded="dataLoaded"
        :rawEvents="rawEvents.filter((event) => event.addedToUserList)"
        @openScheduleModal="openScheduleModalDirect"
      />
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
import ScheduleCarousel from '@/components/ScheduleCarousel.vue';
import generalMixin from '../mixins/general';
import scheduleMixin from '../mixins/schedule';

import Button from '../components/Button.vue';
import LoadingSpinner from '../components/LoadingSpinner.vue';

export default {
  name: 'Schedule',
  mixins: [generalMixin, scheduleMixin],
  components: {
    Button,
    LoadingSpinner,
    ScheduleCarousel,
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
      startDate: new Date(this.getEnvVariable('START_DATE')),
      endDate: new Date(this.getEnvVariable('END_DATE')),
      targetEventId: null,
    };
  },
  async mounted() {
    this.targetEventId = this.$route.query.event;
    this.prepareTimeWindows();
    this.populateDays();
    await this.getEventsFromUserList();
    this.rawEvents = await this.getData(this.getEnvVariable('SCHEDULE_BASE_ENDPOINT'), 'schedule');
    console.log(this.rawEvents);
    this.processRawEvents();
    this.dataLoaded = true;
    if (this.targetEventId && this.rawEvents.find(((event) => event.id === this.targetEventId))) {
      this.openScheduleModalDirect(this.rawEvents.find(((event) => event.id === this.targetEventId)));
    }
    await this.activityTracking('SCHEDULE');
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
  border: 5px solid rgba(23, 33, 222, .5);
  color: rgba(23, 33, 222, .5);
  cursor: pointer;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

.schedule-list-title-item-selected {
  border: 4px solid #1721DE;
  box-shadow: 0px 4px 4px rgba(179, 119, 219, 0.25);
  color: #1721DE;
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
  color: #1721DE;
  background: #90D8F6;
}

.content-item-type-b {
  background: #0099ff;
  border-radius: 8px;
  color: #FFFFFF;
}

.content-item-type-c {
  background: #1721DE;
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
