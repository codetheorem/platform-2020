<template>
  <div class="about">
    <div id="help-body" class="container my-3 my-md-5">
      <h2 class="heading my-3 my-md-5">Photo Booth</h2>
      <div class="row">
        <div class="col-md-1"></div>
        <div class="col-md-10">
          <div class="card">
            <div class="card-body">
                <p>
                  Our virtual photo booth allows for you and other hackers to take photos and videos that you can submit to our montage. Click the links below to open up the booth to take pictures and videos!
                </p>
            </div>
          </div>
        </div>
        <div class="col-md-1"></div>
      </div>
      <div class="display-center">
        <a href="https://www.virtualbooth.me" target="_blank" style="margin-right: 1rem;">
          <Button size="lg" text="Take a Photo"/>
        </a>
        <a href="https://getmontage.co" target="_blank">
          <Button size="lg" text="Record a Video"/>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import Button from '@/components/Button.vue';
import generalMixin from '../mixins/general';

export default {
  name: 'PhotoBooth',
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
