<template>
  <div>
      <div v-if="dataLoaded" id="app-12">
        <b-container style="margin-bottom: 3rem;">
            <b-row>
                <b-col cols="12">
                    <div class="schedule-carousel-title">
                        {{ title }}
                    </div>
                    <carousel :perPage="3" :navigationEnabled="true" paginationColor="#C4C4C4" paginationActiveColor="#8B8787" :mouseDrag="false" :centerMode="true" :loop="true">
                        <slide class="p-2" v-for="(event, index) in rawEvents" :key="event.id">
                            <b-card :title="event.event_name" :img-src="`https://technica-brand-assets.s3.amazonaws.com/schedule${(index % 3) + 1}.png`" img-alt="Image" img-top tag="article">
                                <b-card-text>
                                    {{ getTimeDescriptionForEvent(event) }}
                                </b-card-text>
                                <b-button href="#" variant="secondary" @click="openSchedModal(event)">More info</b-button>
                            </b-card>
                        </slide>
                        <p v-if="rawEvents.length === 0 && useSavedEvents" style="margin-top: 1rem;">Add an event to your list by clicking the star icon next to an event card! Once you add events to your list, you can see your event list here.</p>
                    </carousel>
                </b-col>
            </b-row>
        </b-container>
    </div>
    <LoadingSpinner v-else />
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
    useSavedEvents: {
      type: Boolean,
      default: false,
    },
    selectedEvent: Object,
    dataLoaded: Boolean,
    rawEvents: Array,
  },
  mixins: [generalMixin, scheduleMixin],
  data() {
    return {
      slide: 0,
      sliding: null,
    };
  },
  methods: {
    onSlideStart() {
      this.sliding = true;
    },
    onSlideEnd() {
      this.sliding = false;
    },
    openSchedModal(event) {
      this.$emit('openScheduleModal', event);
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

.VueCarousel-dot-container {
    margin-top: 0px !important;
}
</style>
