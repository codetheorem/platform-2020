<template>
  <div class="banner-wrapper">
    <div class="technica-logo-icon">
    </div>
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
    .technica-logo-icon {
        background: linear-gradient(179.71deg, #23D8D8 -15.87%, #FF639D 99.75%);
        transform: matrix(-0.01, -1, 1, -0.01, 0, 0);
        width: 2rem;
        height: 2rem;
        border-radius: 2rem;
    }
    .banner-wrapper {
        background: #FFFFFF;
        border-radius: 8px;
        filter: drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.25));
        width: 70%;
        padding: 5px;
        padding-bottom: 10px;
    }
    .banner-text {
        margin-left: 1rem;
        margin-right: 1rem;
        margin-top: .25rem;
    }
</style>
