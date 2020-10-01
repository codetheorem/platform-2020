<template>
  <div class="progress-wrapper">
    <span v-for="n in full" class="dot done" :key="n"></span>
    <span v-for="n in half" class="dot doing" :key="n+full"></span>
    <span v-for="n in empty" class="dot to-do" :key="n+full+half"></span>
  </div>
</template>

<script>

export default {
  name: 'ProgressCircles',
  props: {
    full: {
      type: Number,
      default: 0,
    },
    half: {
      type: Number,
      default: 0,
    },
    empty: {
      type: Number,
      default: 0,
    },
  },
};
</script>

<style scoped>

.progress-wrapper {
  display:flex;
  justify-content: center;
}

.dot {
  height: 0.75rem;
  width: 0.75rem;
  border-radius: 50%;
  border: 1px solid #D66D50;
  display: inline-block;
  margin-left: 0.1rem;
  margin-right: 0.1rem
}

.done {
  background-color: #D66D50;
}

.doing {
  background-color: rgba(214, 109, 80, .5);
}

.to-do {
  background-color: #FFF;
}

</style>
