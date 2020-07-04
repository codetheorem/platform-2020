<template>
  <button type="button" class="btn btn-primary btn-lg btn-wrapper" :class="{'btn-sm': size === 'sm', 'outline-style': outlineStyle}">
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
    text: String,
    outlineStyle: {
      type: Boolean,
      default: false
    }
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
        margin-bottom: 15px;
    }

    .btn-wrapper:hover{
        box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.15);
    }

    .btn-wrapper:active {
        background-color: #B377DB !important;
        border: none !important;
        box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.15) !important;
    }

    .outline-style {
      background-color: transparent !important;
      color: #A88AA8;
      border: 2px solid #A88AA8;
    }

    .outline-style:hover{
        color: #B377DB;
        border: 2px solid #B377DB;
    }

    .outline-style:active {
        background-color: #F4EBFA !important;
        box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.15) !important;
        color: #B377DB !important;
        border: 2px solid #B377DB !important;
    }

    .btn-wrapper:focus {
      outline: none;
      box-shadow: none;
    }
</style>
