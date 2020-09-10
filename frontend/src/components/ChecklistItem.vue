<template>
    <div :class="{'item-clicked': checked}">
        <input v-model="checked" type="checkbox" aria-label="Checkbox for following text input" class="list-checkbox" @change="clicked($event)">
        <slot name="text" ></slot>
    </div>
</template>

<script>
import generalMixin from '../mixins/general';
import Config from '../config/general';

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
      const env = this.getCurrentEnvironment();
      const updateChecklistPostParams = {
        id: this.id,
        is_checked: this.checked,
      };
      await this.performPostRequest(Config[env].SPONSORS_INFO_ENDPOINT, env, 'update_project_checklist_item', updateChecklistPostParams);
    },
  },
  async mounted() {
    this.checked = this.isChecked;
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .list-checkbox {
    margin-right: 1rem;
    vertical-align: middle;
  }

  input[type='checkbox'] {
    float: left;
    position: relative;
    cursor: pointer;
    height: 17px;
    width: 17px;
    font-size: 20px !important;
    top: 5px;
  }

  input[type='checkbox']:after {
    content: "";
    vertical-align: middle;
    text-align: center;
    position: absolute;
    cursor: pointer;
    height: 17px;
    width: 17px;
    left: 0;
    top: 0;
    font-size: 15px;
    vertical-align: middle;
    text-align: center;
    line-height: 15px;
    background: #ffffff;
    border: 1px solid #8B8787;
  }

  input[type='checkbox']:checked:after {
    background: #FF5091;
    border: 1px solid #FF5091 !important;
    content: '\2714';
    color: #fff;
  }

  .item-clicked > label{
    color: #979797 !important;
  }

  .item-clicked > label > a {
    color: rgba(234, 102, 142, .75) !important;
  }
</style>
