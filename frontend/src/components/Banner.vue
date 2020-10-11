<template>
  <div class="banner-wrapper">
    <img src="../assets/technica-logo-icon.png" style="width: 30px; height: 30px;">
    <span class="banner-text">{{ text }}</span>
    <Button v-if="displayAcceptButton" text="Accept" @click="handleAcceptClick" size="sm" :outlineStyle="true"/>
  </div>
</template>

<script>
import Button from '@/components/Button.vue';

export default {
  name: 'Banner',
  components: {
    Button,
  },
  props: {
    text: String,
    displayAcceptButton: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleAcceptClick() {
      this.$emit('accept');
    },
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
        filter: drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.25));
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

    .btn-wrapper {
      margin-bottom: 0px !important;
    }

    @media (max-width: 1400px) {
      .banner-text {
        font-size: 14px;
      }
    }
</style>
