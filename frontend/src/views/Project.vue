<template>
  <div>
    <h2 class="page-header">My Project</h2>
    <div class="container mx-auto">
        <div v-if="dataLoaded">
          <div v-if="projectHasAlreadyBeenSubmitted || !readyButtonClicked" class="row">
            <div class="col-md-1"></div>
            <div class="col-md-10">
              <div class="card" style="margin-bottom: 2rem;">
                <EasterEggStamp :displayStamp="displayEasterEgg" @viewEasterEgg="viewEasterEgg()" :totalEasterEggsFound="totalEasterEggsFound" :totalEasterEggs="totalEasterEggs" :postcards="easterEggData"/>
                <div class="card-body">
                    <p>
                      If you are ready to submit your Technica Hack, please click on the button below! <b>Only one hacker needs to submit per team.</b>
                    </p>
                    <p>
                      If the button is grayed out, another member of your team has already submitted your project!
                    </p>
                </div>
              </div>
              <Button size="lg" :text="this.readyButtonText" @click="clickReadyButton" :disabled="this.readyButtonDisabled"/>
            </div>
        </div>

        <div v-else>
            <h4>I have...</h4>
            <div class="content-container row-xl-6">
              <div class="checklist-body">
                <div v-for="checklistItem in checklistItems" :key="checklistItem.title" class="checklist-item">
                  <checklist-item :isChecked="checklistItem.checked" :id="checklistItem.id" @click="toggleCheckboxChecked">
                      <template v-slot:text>
                          <label>{{ checklistItem.title }} <a :href="checklistItem.link" target="_blank" class="project-checklist-link">{{ checklistItem.linkText }}</a></label>
                      </template>
                  </checklist-item>
                </div>
              </div>
              <div>
                <form @submit.prevent="sendMagicLink">
                  <div class="form-group mx-auto">
                    <input type="text" class="form-control col-xl-4 mx-auto project-form-input" id="nameInput" placeholder="Team Name" v-model="teamName">
                    <input type="text" class="form-control col-xl-4 mx-auto project-form-input" id="linkInput" placeholder="Devfolio Link" v-model="devLink">
                    <!-- Prize categories will be implemented in a future ticket -->
                    <!-- <input type="text" class="form-control col-xl-4 mx-auto project-form-input" id="emailInput" placeholder="Prize Categories" v-model="teamName"> -->
                  </div>
                </form>
              </div>
            </div>
            <Button size="lg" text="Submit My Project" :disabled="checklistDisabled" @click="clickSubmitButton"/>
        </div>
      </div>
      <div v-else>
        <LoadingSpinner />
      </div>
    </div>
  </div>
</template>

<script>
import Button from '@/components/Button.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import ChecklistItem from '@/components/ChecklistItem.vue';
import EasterEggStamp from '@/components/EasterEggStamp.vue';
import generalMixin from '../mixins/general';

const EASTER_EGG_ID = 1;
const TOTAL_EASTER_EGGS = 6;

export default {
  name: 'Project',
  mixins: [generalMixin],
  components: {
    Button,
    ChecklistItem,
    LoadingSpinner,
    EasterEggStamp,
  },
  data() {
    return {
      projectHasAlreadyBeenSubmitted: false,
      readyButtonClicked: false,
      dataLoaded: false,
      readyButtonText: "I'm Ready to Submit!",
      readyButtonDisabled: false,
      checklistItems: [
        {
          title: 'submitted my hack on Devpost:',
          link: 'https://hackthemountain.tech/submit',
          linkText: 'hackthemountain.tech/submit',
        },
        {
          title: 'signed up for an expo slot to show off my hack:',
          link: 'https://hackthemountain.tech/expo',
          linkText: 'hackthemountain.tech/expo',
        },
        {
          title: 'submitted my hack to Hack the Mountains below:',
          link: '',
        },
      ],
      teamName: '',
      devLink: '',
      currentTeamId: null,
      checklistCounter: 0,
      displayEasterEgg: false,
      currentEasterEggDBId: null,
      easterEggData: [],
      totalEasterEggsFound: 0,
    };
  },
  async created() {
    await this.getTeam();
    await this.getEasterEggData();
    this.dataLoaded = true;
  },
  methods: {
    async clickSubmitButton() {
      const params = {
        team_id: this.currentTeamId,
        project_submitted: true,
      };
      await this.performPostRequest(this.getEnvVariable('TEAMS_BASE_ENDPOINT'), 'update_team_submission', params);
      this.$router.push('/');
    },
    clickReadyButton() {
      this.readyButtonClicked = true;
    },
    async getEasterEggData() {
      const easterEggParams = {
        user_id: this.getUserId(),
      };
      const easterEggData = await this.performGetRequest(this.getEnvVariable('ADMIN_BASE_ENDPOINT'), 'get_easter_eggs', easterEggParams);
      if (easterEggData && easterEggData[0]) {
        const formattedEEData = [];
        Object.keys(easterEggData).forEach((d) => {
          formattedEEData.push(easterEggData[d]);
        });
        const easterEgg = formattedEEData.find((e) => e.easter_egg_id === EASTER_EGG_ID);
        if (easterEgg) {
          if (easterEgg.discovered === false) {
            this.displayEasterEgg = true;
            this.currentEasterEggDBId = easterEgg.id;
          }
          this.easterEggData = formattedEEData;
          let totalEEFound = 0;
          this.easterEggData.forEach((d) => {
            if (d.discovered) {
              totalEEFound += 1;
            }
          });
          this.totalEasterEggsFound = totalEEFound;
        }
      }
    },
    async getTeam() {
      const teamParams = {
        user_id: this.getUserId(),
      };
      const team = await this.performGetRequest(this.getEnvVariable('TEAMS_BASE_ENDPOINT'), 'get_team_membership_for_user', teamParams);
      if (team[0]) {
        const params = {
          team_id: team[0].team_id,
        };
        // check submission status of project
        const status = await this.performGetRequest(this.getEnvVariable('TEAMS_BASE_ENDPOINT'), 'get_team_submission', params);
        this.projectHasAlreadyBeenSubmitted = status[0].project_submitted;
        if (this.projectHasAlreadyBeenSubmitted) {
          this.readyButtonText = 'Project has been submitted';
          this.readyButtonDisabled = true;
        }
        // get checklist items for team
        const checklist = await this.performGetRequest(this.getEnvVariable('SPONSORS_INFO_ENDPOINT'), 'get_project_checklist_item', params);
        Object.values(checklist).forEach((k) => {
          const item = this.checklistItems.find((j) => k.checklist_item_id === j.title);

          if (item) {
            item.id = k.id;
            item.checked = k.is_checked;
            if (item.checked) {
              this.readyButtonClicked = true;
              this.checklistCounter += 1;
            }
          }
        });
        this.currentTeamId = team[0].team_id;
      }
    },
    toggleCheckboxChecked(id) {
      const item = this.checklistItems.find((j) => id === j.id);
      item.checked = !item.checked;
      if (item.checked) {
        this.checklistCounter += 1;
      } else {
        this.checklistCounter -= 1;
      }
    },
    viewEasterEgg() {
      this.easterEggData.find((e) => e.easter_egg_id === EASTER_EGG_ID).discovered = true;
      this.totalEasterEggsFound += 1;
      this.displayEasterEgg = false;
      const params = {
        user_id: this.getUserId(),
        id: this.currentEasterEggDBId,
      };
      this.performPostRequest(this.getEnvVariable('ADMIN_BASE_ENDPOINT'), 'discover_easter_egg', params);
    },
  },
  computed: {
    checklistDisabled() {
      return (this.devLink === '' || this.teamName === '') || this.checklistCounter !== this.checklistItems.length;
    },
    totalEasterEggs() {
      return TOTAL_EASTER_EGGS;
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

.btn-primary:disabled {
  background-color: #8B8787;
  border-color: #8B8787;
}

.btn-primary:disabled:hover {
  background-color: #8B8787 !important;
  border-color: #8B8787 !important;
}

</style>
