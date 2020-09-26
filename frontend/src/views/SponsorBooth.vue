<template>
  <div class="page-container">
    <div class="sponsor-header">
      <div class="back-button-container">
        <Button size="lg" text="Back to Sponsor List" :outlineStyle="true" :backArrow="true" />
      </div>
      <div class="sponsor-logo">
        <img src="https://technica-brand-assets.s3.amazonaws.com/mlh_logo.png" />
      </div>
      <!-- header-placeholder exists so we can have the logo and back button left and center aligned properly -->
      <div class="header-placeholder"></div>
    </div>
    <div class="sponsor-body">
    </div>
    <div class="sponsor-footer">
    </div>
  </div>
</template>

<script>
import Button from '@/components/Button.vue';
import generalMixin from '../mixins/general';

export default {
  name: 'SponsorBooth',
  components: {
    Button,
  },
  mixins: [generalMixin],
};
</script>

<style scoped>
.page-container {
  display: flex;
  justify-content: center;
  flex-direction: row;
  flex-wrap: wrap;
}

.sponsor-header {
  border: 1px solid red;
  height: 10vh;
  width: 80vw;
  display: flex;
  justify-content: space-between;
  align-content: center;
}

.sponsor-body {
  border: 1px solid green;
  height: 60vh;
  width: 80vw;
}

.sponsor-footer {
  border: 1px solid blue;
  height: 20vh;
  width: 80vw;
}

.back-button-container {
  /* border: 1px solid red; */
  display: flex;
  justify-content: center;
  align-items: center;
}

.sponsor-logo {
  border: 1px solid red;
}

.header-placeholder {
  width: 10%;
  height: 100%;
  border: 1px solid red;
  opacity: 0;
}
</style>
