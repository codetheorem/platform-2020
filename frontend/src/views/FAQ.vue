<template>
  <div>
      <ContentPage title="Frequently Asked Questions" :rightPanelItems="rightPanelItems" :leftPanelItems="leftPanelItems"/>
  </div>
</template>

<script>
import ContentPage from '../components/ContentPage.vue';
import Content from '../config/content';

export default {
  name: 'FAQ',
  components: {
    ContentPage,
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
