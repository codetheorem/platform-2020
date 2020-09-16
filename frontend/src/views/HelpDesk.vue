<template>
  <div class="about">
    <h2 class="page-header">Help Desk</h2>
    <div id="help-body" class="container my-3 my-md-5">
      <div class="row">
        <div class="col-md-1"></div>
        <div class="col-md-10">
          <div class="card">
            <div class="card-body">
                <p>
                  If you have platform related questions, you are in the right place!
                </p>
                <p>
                  For frequently asked questions, check the <a href="https://slack.com" target="_blank">Technica's Slack Workspace</a>!
                <p>
                  For coding/project questions, check out our <router-link to="/request-mentor"><a href="#">Request a Mentor feature</a></router-link>!
                </p>
            </div>
          </div>
        </div>
        <div class="col-md-1"></div>
      </div>
      <div class="row my-3 my-md-5">
        <div class="col-md-3"></div>
        <div class="col-md-2 text-md-right">
          <p class="btn filler pb-0" disabled="true"><b>Need help?</b></p>
        </div>
        <div class="col-md-7 text-md-left">
          <a :href="helpDeskLink" target="_blank">
            <Button size="lg" text="Talk to an organizer over video"/>
          </a><br>
          <a onclick="Intercom('show')">
            <Button size="lg" text="Or, chat with an organizer"/>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Button from '@/components/Button.vue';
import generalMixin from '../mixins/general';
import Config from '../config/general';

export default {
  name: 'HelpDesk',
  mixins: [generalMixin],
  components: {
    Button,
  },
  data() {
    return {
      helpDeskLink: Config.shared.SAMPLE_ZOOM_LINK,
    };
  },
  async mounted() {
    await this.activityTracking('HELPDESK');
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.card-body {
  background-color: var(--light-purple);
}

.filler {
  cursor: text !important;
}

a {
  text-decoration: underline;
}

</style>
