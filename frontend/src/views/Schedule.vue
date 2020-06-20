<template>
  <div class="about">
    <h1>This is a schedule page</h1>
  </div>
</template>

<script>
import generalMixin from '../mixins/general';
export default {
  name: 'Schedule',
  props: {
    msg: String,
  },
  mixins: [generalMixin],
  data(){
    return {
      schedule: []
    }
  },
  async mounted(){
    this.schedule = await this.getData("https://dxz39cp5d0.execute-api.us-east-1.amazonaws.com", "dev", "schedule");
    console.log(this.schedule);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
