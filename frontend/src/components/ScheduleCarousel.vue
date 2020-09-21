<template>
  <div>
      <div id="app-12">
        <b-container style="margin-bottom: 3rem;">
            <b-row>
                <b-col cols="12">
                    <div class="schedule-carousel-title">
                        SCHEDULE HIGHLIGHTS
                    </div>
                    <carousel :perPage="3" :navigationEnabled="true" paginationColor="#C4C4C4" paginationActiveColor="#8B8787" :mouseDrag="false">
                        <slide class="p-2" v-for="slide in 10" :key="slide">
                            <b-card title="Participant Check-in" img-src="https://technica-brand-assets.s3.amazonaws.com/ScheduleCard1.png" img-alt="Image" img-top tag="article">
                            <b-card-text>
                                10:30 pm - 11:30 pm
                            </b-card-text>
                            <b-card-text>
                                Sunday
                            </b-card-text>
                            <b-button href="#" variant="primary">More info</b-button>
                            </b-card>
                        </slide>
                    </carousel>
                </b-col>
            </b-row>
        </b-container>
    </div>
  </div>
</template>

<script>
import VueCarousel from 'vue-carousel';

export default {
  name: 'ScheduleCarousel',
  props: {
  },
  components: {
    carousel: VueCarousel.Carousel,
    slide: VueCarousel.Slide,
  },
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
    }
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
