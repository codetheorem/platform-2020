const eventBrandingTypes = [{ class: 'content-item-type-a', emptyStarImgName: 'star_purple_empty', filledStarImgName: 'star_purple_filled' }, { class: 'content-item-type-b', emptyStarImgName: 'star_white_empty', filledStarImgName: 'star_white_filled' }, { class: 'content-item-type-c', emptyStarImgName: 'star_white_empty', filledStarImgName: 'star_white_filled' }];

export default {
  methods: {
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
      // eslint-disable-next-line max-len
      this.selectedEvent = this.formattedEvents[selectedDay][timeWindow].find((event) => event.column === scheduleColumn);
      this.selectedEvent.selectedDay = selectedDay;
      this.selectedEvent.timeWindow = timeWindow;
      this.selectedEvent.scheduleColumn = scheduleColumn;
      this.$bvModal.show('scheduleEventModal');
    },
    openScheduleModalDirect(event) {
      this.selectedEvent = event;
      this.$bvModal.show('scheduleEventModal');
    },
    addSelectedEventToList() {
      this.$bvModal.hide('scheduleEventModal');
      // eslint-disable-next-line max-len
      this.toggleAddingEventToList(this.selectedEvent);
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
          // eslint-disable-next-line max-len
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
      if (timeWindow === '12AM') {
        return 0;
      }
      if (timeWindow === '12PM') {
        return 12;
      }
      if (timeWindow.includes('AM')) {
        return parseInt(timeWindow.replace(/[^0-9]/g, ''), 10);
      }
      return parseInt(timeWindow.replace(/[^0-9]/g, ''), 10) + 12;
    },
    getEventsForTimeWindow(timeWindow, day) {
      const eventsForWindow = this.rawEvents.filter((rawEvent) => {
        const rawEventStart = (new Date(rawEvent.start_time));
        // eslint-disable-next-line max-len
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
      const images = require.context('../assets', false);
      const imageType = (event.addedToUserList ? 'filledStarImgName' : 'emptyStarImgName');
      const ext = (event.branding[imageType].includes('purple')) ? '.svg' : '.png';
      return images(`./${event.branding[imageType]}${ext}`);
    },
    async toggleAddingEventToList(targetEvent) {
      // eslint-disable-next-line no-param-reassign
      targetEvent.addedToUserList = !targetEvent.addedToUserList;
      this.$forceUpdate();

      if (!this.eventsInUserList.map((event) => event.event_id).includes(targetEvent.id)) {
        const addEventToUserListParams = {
          user_id: this.getUserId(),
          event_id: targetEvent.id,
        };
        const addedId = await this.performPostRequest(this.getEnvVariable('SCHEDULE_BASE_ENDPOINT'), 'add_event_to_user_list', addEventToUserListParams);
        // eslint-disable-next-line no-param-reassign
        targetEvent.addedEventId = addedId.id;
        this.eventsInUserList.push({ event_id: targetEvent.id, id: addedId.id });
      } else {
        const removeEventParams = {
          id: targetEvent.addedEventId,
        };
        await this.performPostRequest(this.getEnvVariable('SCHEDULE_BASE_ENDPOINT'), 'delete_event_from_user_list', removeEventParams);
      }
    },
    async getEventsFromUserList() {
      const userParams = {
        user_id: this.getUserId(),
      };
      const rawEvents = await this.performGetRequest(this.getEnvVariable('SCHEDULE_BASE_ENDPOINT'), 'get_events_from_user_list', userParams);
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
