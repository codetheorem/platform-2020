<template>
  <div class="schedule-page">
    <h2 class="page-header">Events</h2>
    <div v-if="dataLoaded" class="schedule-list">
      <ScheduleCarousel title="SCHEDULE HIGHLIGHTS" style="margin-top: -5rem;"/>
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
  </div>
</template>

<script>
import generalMixin from '../mixins/general';
import scheduleMixin from '../mixins/schedule';

import Config from '../config/general';
import Button from '../components/Button.vue';
import LoadingSpinner from '../components/LoadingSpinner.vue';
import ScheduleCarousel from '@/components/ScheduleCarousel.vue';

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
      startDate: new Date(Config.shared.START_DATE),
      endDate: new Date(Config.shared.END_DATE),
    };
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
