<template>
  <button
    type="button"
    class="btn btn-primary btn-lg btn-wrapper"
    :class="{'btn-sm': size === 'sm', 'outline-style': outlineStyle}"
    @click="clicked"
  >
    <span>{{ text }}</span>
  </button>
</template>

<script>
export default {
  name: 'Button',
  props: {
    size: {
      type: String,
      default: 'lg',
    },
    text: String,
    outlineStyle: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    clicked() {
      this.$emit('click');
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.btn-wrapper {
  background-color: #a88aa8;
  border: none;
  border-radius: 8px;
  font-family: Noto Sans;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 22px;
  margin-bottom: 15px;
  border: 2px solid #a88aa8;
}

.btn-wrapper:hover {
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.15);
}

.btn-wrapper:active {
  background-color: #b377db !important;
  border: 2px solid #b377db !important;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.15) !important;
}

.outline-style {
  background-color: transparent !important;
  color: #a88aa8;
  border: 2px solid #a88aa8;
}

.outline-style:hover {
  color: #b377db;
  border: 2px solid #b377db;
}

.outline-style:active {
  background-color: #f4ebfa !important;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.15) !important;
  color: #b377db !important;
  border: 2px solid #b377db !important;
}

.btn-wrapper:focus {
  outline: none;
  box-shadow: none;
}
</style>
