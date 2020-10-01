<template>
    <label class="container">
      <input v-model="checked" type="checkbox" aria-label="Checkbox for following text input" class="list-checkbox" @change="clicked($event)">
      <span class="checkmark"></span>
      <slot name="text" ></slot>
    </label>
</template>

<script>
import generalMixin from '../mixins/general';

export default {
  name: 'ChecklistItem',
  mixins: [generalMixin],
  data() {
    return {
      checked: false,
    };
  },
  props: {
    isChecked: {
      type: Boolean,
      default: false,
    },
    id: {
      type: String,
      default: 'None',
    },
  },
  methods: {
    clicked() {
      this.$emit('click', this.id);
      this.update();
    },
    async update() {
      const updateChecklistPostParams = {
        id: this.id,
        is_checked: this.checked,
      };
      await this.performPostRequest(this.getEnvVariable('SPONSORS_INFO_ENDPOINT'), 'update_project_checklist_item', updateChecklistPostParams);
    },
  },
  async mounted() {
    this.checked = this.isChecked;
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  /* Customize the label (the container) */
.container {
  display: block;
  position: relative;
  padding-left: 50px;
  cursor: pointer;
  font-size: 20px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

}

/* Hide the browser's default checkbox */
.container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

/* Create a custom checkbox */
.checkmark {
  position: absolute;
  top: 3px;
  left: 0;
  height: 25px;
  width: 25px;
  background-color: #ccc;
}

/* When the checkbox is checked, add a background */
.container input:checked ~ .checkmark {
  background-color: #CA484F;
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
  position: absolute;
  display: none;
  content: '\2714';
  color: #fff;
}

/* Show the checkmark when checked */
.container input:checked ~ .checkmark:after {
  display: block;
}

/* Style the checkmark/indicator */
.container .checkmark:after {
  left: 5px;
  top: -3px;
}
</style>
