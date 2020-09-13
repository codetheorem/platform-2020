<template>
    <div class="stamp-wrapper" @click="viewEasterEgg()">
        <img src="../assets/stamp.png" class="stamp-img">
    </div>
</template>

<script>

export default {
  name: 'EasterEggStamp',
  methods: {
    viewEasterEgg() {
          this.$emit("viewEasterEgg");
    }
  }
};
</script>

<style>
.stamp-wrapper {
    position: absolute;
    z-index: 1 !important;
    margin-left: -1rem;
    margin-top: -1rem;
}

.stamp-img:hover {
    filter: drop-shadow(0px 0px 12px rgba(255, 80, 145, 0.7));
    cursor: pointer;
}
</style>
