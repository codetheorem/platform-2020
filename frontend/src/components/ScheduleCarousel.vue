<template>
  <div>
      <div v-if="dataLoaded" id="app-12">
        <b-container style="margin-bottom: 3rem;">
            <b-row>
                <b-col cols="12">
                    <div class="schedule-carousel-title">
                        {{ title }}
                    </div>
                    <carousel :perPage="3" :navigationEnabled="true" paginationColor="#C4C4C4" paginationActiveColor="#8B8787" :mouseDrag="false">
                        <slide class="p-2" v-for="(event, index) in rawEvents.slice(0, 9)" :key="event.id">
                            <b-card :title="event.event_name" :img-src="`https://technica-brand-assets.s3.amazonaws.com/ScheduleCard${(index % 3) + 1}.png`" img-alt="Image" img-top tag="article">
                            <b-card-text>
                                {{ getTimeDescriptionForEvent(event) }}
                            </b-card-text>
                            <b-button href="#" variant="secondary" @click="openScheduleModalDirect(event)">More info</b-button>
                            </b-card>
                        </slide>
                    </carousel>
                </b-col>
            </b-row>
        </b-container>
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
import { Carousel, Slide } from 'vue-carousel';
import generalMixin from '../mixins/general';
import scheduleMixin from '../mixins/schedule';
import Config from '../config/general';
import Button from './Button.vue';
import LoadingSpinner from './LoadingSpinner.vue';

export default {
  name: 'ScheduleCarousel',
  components: {
    carousel: Carousel,
    slide: Slide,
    Button,
    LoadingSpinner,
  },
  props: {
    title: String,
  },
  mixins: [generalMixin, scheduleMixin],
  data() {
    return {
      slide: 0,
      sliding: null,
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
  methods: {
    onSlideStart() {
      this.sliding = true;
    },
    onSlideEnd() {
      this.sliding = false;
    },
  },
};
</script>

<style>
.row {
  margin-top:100px;
}

.schedule-carousel-title {
    font-family: DIN Pro;
    font-style: normal;
    font-weight: bold;
    font-size: 26px;
    line-height: 31px;
    text-align: center;
    color: #2D2D2D;
}

.card-title {
    font-size: 20px;
}
</style>
