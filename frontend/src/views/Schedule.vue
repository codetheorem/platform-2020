<template>
  <div class="about">
    <h1>This is a schedule page</h1>
    <table id="schedule-table">
      <tr>
        <th>Name</th>
        <th>Category</th>
        <th>Description</th>
        <th>Start Time</th>
      </tr>
      <tr v-for="event in schedule" :key="event.id" class="schedule-item">
        <td>{{ event.name}}</td>
        <td>{{ event.category}}</td>
        <td>{{ event.description}}</td>
        <td>{{ getFormattedTime(event.start_time)}}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import generalMixin from '../mixins/general';
import Config from '../config/general';

export default {
  name: 'Schedule',
  props: {
    msg: String,
  },
  mixins: [generalMixin],
  data() {
    return {
      schedule: [],
    };
  },
  async mounted() {
    console.log(process.env.NODE_ENV);
    this.schedule = await this.getData(Config.dev.SCHEDULE_BASE_ENDPOINT, 'dev', 'schedule');
    console.log(this.schedule);
  },
  methods: {
    getFormattedTime(rawDateTime) {
      return (new Date(rawDateTime)).toTimeString();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.schedule-item {
  padding: 10px;
  border: 1px solid turquoise;
}

#schedule-table {
  margin: 0 auto;
}

td, th {
  border: 1px solid turquoise;
  padding: 10px;
}
</style>
