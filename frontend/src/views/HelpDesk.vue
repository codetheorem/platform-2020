<template>
  <div class="about">
    <div class="container my-3 my-md-5">
      <h2 class="heading my-3 my-md-5">Help Desk</h2>
      <div class="row">
        <div class="col-md-1"></div>
        <div class="col-md-10">
          <div class="card">
            <div class="card-body">
                <p>
                  If you have platform related questions, you are in the right place!
                </p>
                <p>
                  For frequently asked questions, check <a href="https://google.com">Technica's Slack Workspace</a>!
                <p>
                  For coding/project questions, checkout out our <a href="https://google.com">Request a Mentor feature</a>!
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
          <a href="https://www.google.com" target="_blank">
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

export default {
  name: 'Help Desk',
  mixins: [generalMixin],
  components: {
    Button,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.heading {
  color: var(--bright-purple);
}

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
