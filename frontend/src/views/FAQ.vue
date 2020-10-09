<template>
  <div>
      <EasterEggStamp :easterEggID="6" />
      <ContentPage title="Frequently Asked Questions" :rightPanelItems="rightPanelItems" :leftPanelItems="leftPanelItems"/>
  </div>
</template>

<script>
import ContentPage from '../components/ContentPage.vue';
import Content from '../config/content';
import EasterEggStamp from '@/components/EasterEggStamp.vue';

export default {
  name: 'FAQ',
  components: {
    ContentPage,
    EasterEggStamp
  },
  computed: {
    rightPanelItems() {
      return Content.FAQ.rightPanelItems;
    },
    leftPanelItems() {
      return Content.FAQ.leftPanelItems;
    },
  },
};
</script>

<style scoped>

</style>
