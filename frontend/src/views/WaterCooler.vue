<template>
  <div class="about">
    <div id="help-body" class="container my-3 my-md-5">
      <h2 class="heading my-3 my-md-5">Networking: Virtual Water Cooler</h2>
      <div class="row">
        <div class="col-md-1"></div>
        <div class="col-md-10">
          <div class="card">
            <div class="card-body">
                <p>
                  The water cooler is a room where you will be paired with other hackers to meet, network, and interact. Once you join the room,
                  you will be paired with other hackers by Technica organizers in a breakout room. Click the link below to join and meet other people!
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
</style>
