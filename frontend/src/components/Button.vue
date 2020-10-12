<template>
  <button
    type="button"
    class="btn btn-primary btn-lg btn-wrapper"
    :class="{'btn-sm': size === 'sm', 'outline-style': outlineStyle}"
    @click="clicked"
  >
    <img v-if="backArrow" src="../assets/back_arrow.svg" style="margin-right: .5rem; margin-top: -.25rem;">
    <span>{{ text }}</span>
    <img v-if="downloadButton" src="../assets/download.svg" style="margin-left: .75rem; margin-top: -.25rem;">
    <img v-if="editButton" src="../assets/edit.svg" style="margin-left: .75rem; margin-top: -.25rem;">
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
    backArrow: {
      type: Boolean,
      default: false,
    },
    downloadButton: {
      type: Boolean,
      default: false,
    },
    editButton: {
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
  background-color: #1721DE;
  border: none;
  border-radius: 8px;
  font-family: Noto Sans;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 22px;
  margin-bottom: 15px;
  border: 2px solid #1721DE;
}

.btn-wrapper:hover {
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.15);
  background-color: #1721DE !important;
  border-color: #1721DE !important;
}

.btn-wrapper:active {
  background-color: #1721DE !important;
  border: 2px solid #1721DE !important;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.15) !important;
}

.btn-wrapper:focus {
  background-color: #1721DE !important;
  border: 2px solid #1721DE !important;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.15) !important;
}

.outline-style {
  background-color: transparent !important;
  color: #1721DE;
  border: 2px solid #1721DE;
}

.outline-style:hover {
  color: #1721DE;
  border: 2px solid #1721DE;
  background-color: transparent !important;
}

.outline-style:active {
  background-color: #f4ebfa !important;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.15) !important;
  color: #1721DE !important;
  border: 2px solid #1721DE !important;
}

.btn-wrapper:focus {
  outline: none;
  box-shadow: none;
}
</style>
