<template>
  <div>
    <h2 class="page-header">My Project</h2>
    <div class="container mx-auto">
      <h2 class="heading my-3 my-md-5">My Project</h2>
        <div v-if="dataLoaded">
          <div v-if="!projectHasAlreadyBeenSubmitted && !readyButtonClicked" class="row">
            <div class="col-md-1"></div>
            <div class="col-md-10">
              <div class="card" style="margin-bottom: 2rem;">
                <div class="card-body">
                    <p>
                      If you are ready to submit your Technica Hack, please click on the button below! <b>Only one hacker needs to submit per team.</b>
                    </p>
                    <p>
                      If the button is grayed out, another member of your team has already submitted your project!
                    </p>
                </div>
              </div>
              <Button size="lg" text="I'm Ready to Submit!" @click="clickReadyButton"/>
            </div>
        </div>

        <div v-else>
            <h4>I have...</h4>
            <div class="content-container row-xl-6">
              <div class="checklist-body">
                <div v-for="checklistItem in checklistItems" :key="checklistItem.title" class="checklist-item">
                  <checklist-item :isChecked="checklistItem.checked" :id="checklistItem.id">
                      <template v-slot:text>
                          <label>{{ checklistItem.title }} <a :href="checklistItem.link" target="_blank" class="project-checklist-link">{{ checklistItem.linkText }}</a></label>
                      </template>
                  </checklist-item>
                </div>
              </div>
              <div>
                <form @submit.prevent="sendMagicLink">
                  <div class="form-group mx-auto">
                    <input type="text" class="form-control col-xl-4 mx-auto project-form-input" id="emailInput" placeholder="Team Name" v-model="teamName">
                    <input type="text" class="form-control col-xl-4 mx-auto project-form-input" id="emailInput" placeholder="Devpost Link" v-model="teamName">
                    <!-- Prize categories will be implemented in a future ticket -->
                    <!-- <input type="text" class="form-control col-xl-4 mx-auto project-form-input" id="emailInput" placeholder="Prize Categories" v-model="teamName"> -->
                  </div>
                </form>
              </div>
            </div>
            <Button size="lg" text="Submit My Project" @click="clickSubmitButton"/>
        </div>
      </div>
      <div v-else>
        <div class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Button from '@/components/Button.vue';
import ChecklistItem from '@/components/ChecklistItem.vue';
import generalMixin from '../mixins/general';
import Config from '../config/general';

export default {
  name: 'Project',
  mixins: [generalMixin],
  components: {
    Button,
    ChecklistItem,
  },
  data() {
    return {
      projectHasAlreadyBeenSubmitted: false,
      readyButtonClicked: false,
      dataLoaded: false,
      checklistItems: [
        {
          title: 'submitted my hack on Devpost:',
          link: 'https://gotechnica.org/submit',
          linkText: 'gotechnica.org/submit',
        },
        {
          title: 'signed up for an expo slot to show off my hack:',
          link: 'https://gotechnica.org/expo',
          linkText: 'gotechnica.org/expo',
        },
        {
          title: 'submitted my hack to Technica below:',
          link: '',
        },
      ],

      currentTeamId: null,
    };
  },
  async created() {
    await this.getTeam();
    this.dataLoaded = true;
  },
  methods: {
    clickSubmitButton() {
      this.$router.push('/');
    },
    clickReadyButton() {
      this.readyButtonClicked = true;
    },
    async getTeam() {
      const env = this.getCurrentEnvironment();
      const teamParams = {
        user_id: this.getUserId(),
      };
      const team = await this.performGetRequest(Config[env].TEAMS_BASE_ENDPOINT, env, 'get_team_membership_for_user', teamParams);
      if (team[0]) {
        const params = {
          team_id: team[0].team_id,
        };
        const checklist = await this.performGetRequest(Config[env].SPONSORS_INFO_ENDPOINT, env, 'get_project_checklist_item', params);
        Object.values(checklist).forEach((k) => {
          const item = this.checklistItems.find((j) => k.checklist_item_id === j.title);

          if (item) {
            item.id = k.id;
            item.checked = k.is_checked;
            if (item.checked) {
              this.readyButtonClicked = true;
            }
          }
        });
        this.currentTeamId = team[0].team_id;
      }
    },
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

.content-container {
    background: #FFFFFF;
    border-radius: 8px;
    padding: 3rem;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 4px;
    text-align: center;
    margin-bottom: 2rem;
}

.project-checklist-link {
  color: var(--pastel-pink);
  text-decoration: underline;
}

.checklist-item {
  float: left;
}

.checklist-body {
  width: 80%;
  display: inline-block;
}

.form-control {
  margin-bottom: 1rem;
}

</style>
