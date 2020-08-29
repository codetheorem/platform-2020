<template>
  <div class="about">
    <div id="help-body" class="container my-3 my-md-5">
      <h2 class="heading my-3 my-md-5">Virtual Water Cooler</h2>
      <div class="row">
        <div class="col-md-1"></div>
        <div class="col-md-10">
          <div class="card">
            <div class="card-body">
                <p>
                  The watercooler is a random room where you will be paired with other hackers to meet and interact. Click the link below to join and meet other people!
                </p>
            </div>
          </div>
        </div>
        <div class="col-md-1"></div>
      </div>
      <div class="display-center">
        <a href="https://zoom.us" target="_blank">
          <Button size="lg" text="Join a room"/>
        </a><br>
      </div>
    </div>
  </div>
</template>

<script>
import Button from '@/components/Button.vue';
import generalMixin from '../mixins/general';

export default {
  name: 'WaterCooler',
  mixins: [generalMixin],
  components: {
    Button,
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
