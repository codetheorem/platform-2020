<template>
  <div class="page-container">
    <div class="sponsor-header">
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
</style>
