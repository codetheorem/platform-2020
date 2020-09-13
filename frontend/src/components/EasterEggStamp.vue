<template>
    <div>
        <div class="stamp-wrapper" @click="viewEasterEgg()" v-b-modal.easterEggModal>
            <img src="../assets/stamp.png" class="stamp-img">
        </div>
        <b-modal id="easterEggModal" :title="modalTitle">
            <p class="my-4">Hello from modal!</p>
        </b-modal>
    </div>
</template>

<script>

export default {
  name: 'EasterEggStamp',
  methods: {
    viewEasterEgg() {
        //   this.$emit("viewEasterEgg");
    }
  },
  props: {
    totalEasterEggsFound: Number,
    totalEasterEggs: Number,
  },
  computed: {
      modalTitle() {
          return `You’ve found ${this.totalEasterEggsFound} out of the ${this.totalEasterEggs} postcards!`;
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
