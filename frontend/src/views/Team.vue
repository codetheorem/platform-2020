<template>
  <div class="page-container">
    <b-container class="teams-container">
      <h2 style="margin-bottom: 1.5rem;">Team Formation</h2>
      <div v-if="!currentTeam" class="create-team-container">
        <form @submit.prevent="goToProfile" class="create-team-form">
          <div class="form-group">
            <div class="input-wrapper">
              <input type="text" class="form-control mx-auto" id="nameInput" placeholder="Enter Team Name" v-model="teamName">
            </div>
          </div>
        </form>
        <Button size="lg" text="Create Team" @click="createTeam()" class="create-team-button"/>
      </div>
      <div class="team-section">
        <SectionTitle :title="sectionTitle" class="invites-divider"/>
        <b-row v-if="!currentTeam && invites.length === 0" class="pending-invites">
          <span>You have no pending invites!</span>
        </b-row>
        <b-row v-if="currentTeam" class="team-list-container">
          <div v-for="teamMember in currentTeam.members" :key="teamMember.id" class="team-list-item">
            <span class="team-list-segment">
              {{ teamMember.full_name }}
            </span>
            <span class="team-list-segment">
              {{ teamMember.email }}
            </span>
            <span>
              {{ teamMember.school }}
            </span>
          </div>
        </b-row>
      </div>
    </b-container>
    <div v-if="currentTeam" class="create-team-container invite-container">
      <form @submit.prevent="inviteHacker" class="create-team-form">
        <div class="form-group">
          <div class="input-wrapper">
            <input type="text" class="form-control mx-auto" id="nameInput" placeholder="Enter Hacker Email" v-model="inviteEmail">
          </div>
        </div>
      </form>
      <Button size="lg" text="Invite Hacker" @click="inviteHacker()" class="create-team-button"/>
    </div>
    <div v-if="currentTeam">
      <Button size="lg" text="Leave Team" @click="leaveTeam()" class="create-team-button" style="background: white !important;" :outlineStyle="true"/>
    </div>
  </div>
</template>

<script>
import SectionTitle from '@/components/SectionTitle.vue';
import Button from '@/components/Button.vue';
import generalMixin from '../mixins/general';
import Config from '../config/general';

export default {
  name: 'Team',
  components: {
    SectionTitle,
    Button,
  },
  mixins: [generalMixin],
  data() {
    return {
      teamName: '',
      invites: [],
      inviteEmail: '',
      currentTeam: null,
    };
  },
  async mounted() {
    await this.getInvites();
    await this.getTeam();
  },
  computed: {
    sectionTitle() {
      return !this.currentTeam ? 'Invites' : this.currentTeam.name;
    },
  },
  methods: {
    async createTeam() {
      const env = this.getCurrentEnvironment();
      const createTeamPostParams = {
        team_name: this.teamName,
      };
      const createdTeam = await this.performPostRequest(Config[env].TEAMS_BASE_ENDPOINT, env, 'create_team', createTeamPostParams);
      // after creating the new team, join it
      const joinTeamPostParams = {
        team_id: createdTeam.id,
        user_id: this.getUserId(),
      };
      await this.performPostRequest(Config[env].TEAMS_BASE_ENDPOINT, env, 'join_team', joinTeamPostParams);
      await this.getTeam();
      this.teamName = '';
    },
    async getInvites() {
      const params = {
        user_id: this.getUserId(),
      };
      const env = this.getCurrentEnvironment();
      const invites = await this.performGetRequest(Config[env].TEAMS_BASE_ENDPOINT, env, 'get_team_invites', params);
      if (invites.length > 0) {
        this.invites = invites;
      }
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
        const teamMembers = await this.performGetRequest(Config[env].TEAMS_BASE_ENDPOINT, env, 'get_users_for_team', params);
        this.currentTeam = {};
        this.currentTeam.members = teamMembers;
        this.currentTeam.name = 'My Team';
      }
    },
    async inviteHacker() {
      this.inviteEmail = '';
    },
    async leaveTeam() {
      const env = this.getCurrentEnvironment();
      const params = {
        user_id: this.getUserId(),
      };
      await this.performPostRequest(Config[env].TEAMS_BASE_ENDPOINT, env, 'leave_team', params);
      this.currentTeam = null;
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

.team-section {
  padding: 10px;
}

.create-team-container {
  width: 22.5vw;
  display: inline-block;
}

@media (max-width: 1500px) {
  .create-team-container {
    width: 40.5vw;
  }
}

@media (max-width: 800px) {
  .create-team-container {
    width: 70.5vw;
  }
}

.create-team-form {
  display: inline-block;
  width: 60%;
}

.create-team-button {
  margin-bottom: 0;
  margin-left: 1.5rem;
}

.pending-invites {
  background: #DED2E6;
  border-radius: 5px;
  flex: auto;
  justify-content: center;
  align-items: center;
  height: 2rem;
}

.invites-divider {
  margin-bottom: 1rem;
}

.team-list-container {
  background: #FFFFFF;
  border-radius: 8px;
  width: 100%;
  margin-top: 3rem;
  height: 30vh;
  padding: 20px;
}

.team-list-item {
  display: flex;
  justify-content: space-around;
  width: 100%;
  height: fit-content;
  padding: 10px;
  border: 1px solid #B6A1C4;
  border-radius: 4px;
}

.team-list-segment {
  border-right: 1px solid #B6A1C4;
  padding-right: 5rem;
}

.invite-container {
  margin-bottom: 2rem;
}
</style>
