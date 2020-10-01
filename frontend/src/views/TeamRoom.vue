<template>
  <div>
    <b-container class="teams-container">
      <h2 class="page-header">Team Room</h2>
      <div v-if="dataLoaded" class="display-container">
        <div>
            <div v-for="(member, index) in currentTeam.members" :key="member.id" class="member-list-item">
                <img v-bind:src="getImgUrl(photos[index])" class="member-list-photo"/>
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
      <LoadingSpinner v-else />
    </b-container>
  </div>
</template>

<script>
import Button from '@/components/Button.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import generalMixin from '../mixins/general';

export default {
  name: 'TeamRoom',
  components: {
    Button,
    LoadingSpinner,
  },
  mixins: [generalMixin],
  data() {
    return {
      currentTeam: null,
      photos_path: '../assets/profile_pics/',
      photos: ['Profile Sun', 'Profile Mountain', 'Profile Cloud 2', 'Profile Wave', 'Profile Cloud 1'],
      dataLoaded: false,
    };
  },
  async mounted() {
    await this.getTeam();
    this.dataLoaded = true;
  },
  methods: {
    async getTeam() {
      const teamParams = {
        user_id: this.getUserId(),
      };
      const team = await this.performGetRequest(this.getEnvVariable('TEAMS_BASE_ENDPOINT'), 'get_team_membership_for_user', teamParams);
      if (team[0]) {
        const params = {
          team_id: team[0].team_id,
        };
        const teamMembers = await this.performGetRequest(this.getEnvVariable('TEAMS_BASE_ENDPOINT'), 'get_users_for_team', params);
        const teamInfoParams = {
          id: team[0].team_id,
        };
        const teamInfo = await this.performGetRequest(this.getEnvVariable('TEAMS_BASE_ENDPOINT'), 'get_team', teamInfoParams);
        this.currentTeam = {};
        this.currentTeam.members = teamMembers;
        this.currentTeam.name = 'My Team';
        // eslint-disable-next-line prefer-destructuring
        this.currentTeam.teamInfo = teamInfo;
      }
    },
    joinSlack() {
      const win = window.open('https://slack.com', '_blank');
      win.focus();
    },
    joinZoom() {
      const win = window.open(this.currentTeam.teamInfo.zoom_link, '_blank');
      win.focus();
    },
    // this tricky function resolves image paths dynamically
    getImgUrl(imgName) {
      const images = require.context('../assets/profile_pics', false, /\.png$/);
      return images(`./${imgName}.png`);
    },
  },
};
</script>

<style scoped>
h2 {
  color: var(--bright-purple);
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
