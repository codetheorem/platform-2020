<template>
  <div class="about">
    <h2 class="page-header">Networking: Virtual Water Cooler</h2>
    <div id="help-body" class="container my-3 my-md-5">
      <div class="row">
        <div class="col-md-1"></div>
        <div class="col-md-10">
          <div class="card">
            <div class="card-body">
                <p>
                  The water cooler is a room where you will be paired with other hackers to meet, network, and interact. Once you join the room,
                  you will be paired with other hackers by Technica organizers in a breakout room for 10 minutes at a time.
                  Click the link below to join and meet other people!
                </p>
            </div>
          </div>
        </div>
        <div class="col-md-1"></div>
      </div>
      <div class="display-center">
        <a :href="waterCoolerLink" target="_blank">
          <Button size="lg" text="Join a room"/>
        </a><br>
      </div>
    </div>
    <div class="watercooler-wrapper">
      <img src="@/assets/watercooler.png" alt="Two technica hackers getting to know each other" class="watercooler-image">
    </div>
  </div>
</template>

<script>
import Button from '@/components/Button.vue';
import generalMixin from '../mixins/general';
import Config from '../config/general';

export default {
  name: 'WaterCooler',
  mixins: [generalMixin],
  components: {
    Button,
  },
  computed: {
    waterCoolerLink() {
      return Config.shared.SAMPLE_ZOOM_LINK;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.heading {
  color: var(--bright-purple);
}

.card-body {
  background-color: var(--light-purple);
}

.filler {
  cursor: text !important;
}

a {
  text-decoration: underline;
}

.display-center {
  margin-top: 1rem;
}

.watercooler-wrapper {
  display:flex;
  justify-content: center;
}

.watercooler-image {
  max-width: 75vw;
  max-height: 55vh;
  position: fixed;
  bottom: 0;
  z-index: 10;
}

@media (max-width: 1500px) {
  .watercooler-image {
    max-width: 50vw;
  }
}

@media (max-width: 800px) {
  .watercooler-image {
    max-width: 40vw;
  }
}

@media (max-height: 850px) {
  .watercooler-image {
    max-height: 35vh;
  }
}

</style>
