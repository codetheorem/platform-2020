<template>
  <div class="banner-wrapper">
    <span class="banner-text">{{ text }}</span>
  </div>
</template>

<script>
export default {
  name: 'Banner',
  props: {
    text: String,
  },
};
</script>

<style scoped>
    .banner-wrapper {
        display: flex;
        justify-content: center;
        align-content: center;
        text-align: center;
        margin: .5rem;
    }
    .banner-wrapper {
        background: #FFFFFF;
        border-radius: 8px;
        filter: drop-shadow(0px 2px 2px #f7c2bb);
        width: 80%;
        padding: 5px;
        padding-bottom: 10px;
        height: fit-content;
    }
    .banner-text {
        margin-left: 1rem;
        margin-right: 1rem;
        margin-top: .25rem;
    }
</style>
