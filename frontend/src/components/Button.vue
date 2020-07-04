<template>
  <button type="button" class="btn btn-primary btn-lg btn-wrapper" :class="{'btn-sm': size === 'sm'}">
      <span>{{ text }}</span>
  </button>
</template>

<script>
export default {
  name: 'Button',
  props: {
    size: {
        type: String,
        default: "lg"
    },
    text: String
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .btn-wrapper {
        background-color: #A88AA8;
        border: none;
        border-radius: 8px;
        font-family: Noto Sans;
        font-style: normal;
        font-weight: bold;
        font-size: 16px;
        line-height: 22px;
    }

    .btn-wrapper:hover{
        box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.15);
    }

    .btn-wrapper:active {
        background-color: #B377DB !important;
        border: none !important;
    }
</style>
