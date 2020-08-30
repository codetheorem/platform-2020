<template>
  <div class="page-container">
    <b-container id="mentor-container" class="mentor-container">
      <h2 style="margin-bottom: 1.5rem;">Request a Mentor</h2>
    </b-container>
  </div>
</template>

<script>
import SectionTitle from '@/components/SectionTitle.vue';
import Button from '@/components/Button.vue';
import Banner from '@/components/Banner.vue';
import generalMixin from '../mixins/general';
import Config from '../config/general';

export default {
  name: 'RequestMentor',
  components: {
    SectionTitle,
    Button,
    Banner,
  },
  mixins: [generalMixin],
  data() {
    return {

    };
  },
  mounted() {

  },
  computed: {

  },
  methods: {

  },
};
</script>

<style scoped>
h2 {
  color: var(--bright-purple);
}

.page-container {
  background-color: #F6F4F7;
  width: 100vw;
  height: 100vh;
}

.mentor-container {
  padding: 30px;
}

</style>
