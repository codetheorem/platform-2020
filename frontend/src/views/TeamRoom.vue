<template>
  <div class="page-container">
    <b-container class="teams-container" v-if="currentTeam">
      <h2 style="margin-bottom: 1.5rem;">Team Room</h2>
      <div class="display-container">
        <div>
            <div v-for="member in currentTeam.members" :key="member.id" class="member-list-item">
                <div class="member-list-photo" />
                <div class="member-list-info">
                    <div><b>{{ member.full_name }}</b></div>
                    <div>{{ member.email }}</div>
                </div>
            </div>
        </div>
        <div>
            <div>
                <Button size="lg" text="Slack Chat" @click="joinSlack()" class="create-team-button"/>
            </div>
            <Button size="lg" text="Join Video Call" @click="joinZoom()" class="create-team-button" style="background: #EA668E !important; border: #EA668E !important;"/>
        </div>
      </div>
    </b-container>
  </div>
</template>

<script>
import Button from '@/components/Button.vue';
import generalMixin from '../mixins/general';
import Config from '../config/general';

export default {
  name: 'TeamRoom',
  components: {
    Button,
  },
  mixins: [generalMixin],
  data() {
    return {
      currentTeam: null,
    };
  },
  async mounted() {
    await this.getTeam();
  },
  methods: {
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
        const teamMembers = await this.performGetRequest(Config[env].TEAMS_BASE_ENDPOINT, env, 'get_users_for_team', params);
        this.currentTeam = {};
        this.currentTeam.members = teamMembers;
        this.currentTeam.name = 'My Team';
      }
    },
    joinSlack() {
      const win = window.open('https://slack.com', '_blank');
      win.focus();
    },
    joinZoom() {
      const win = window.open('https://zoom.com', '_blank');
      win.focus();
    },
  },
};
</script>

<style scoped>
h2 {
  color: var(--bright-purple);
}

.page-container {
  background-color: #F6F4F7;
  width: 100vw;
  height: 100vh;
}

.teams-container {
  padding: 30px;
}

.display-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.member-list-item {
    width: 100%;
    border: 2px solid #A88AA8;
    box-sizing: border-box;
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    display: flex;
}

.member-list-photo {
    background: #C4C4C4;
    border-radius: 2px;
    width: 7rem;
    height: 7rem;
    margin: 3px;
}

.member-list-info {
    margin-top: 1rem;
    margin-bottom: 2rem;
    margin-right: 1rem;
    margin-left: .75rem;
}
</style>