<template>
  <div>
    <div v-if="dataLoaded">
      <h2 class="page-header">My Team</h2>
      <b-container id="team-container" class="teams-container">
        <p>Looking for teammates to collaborate with on your hack? Head over to our <router-link :to="'/schedule?event=' + teamFormationEventId"><a href="#" class="redirect-link">team formation event</a></router-link>.</p>
        <p>Once you know who your teammates are, use this page to create your team in the Technica system! You can then do things like submit your project or request a mentor as a team.</p>
        <p><b>You still need to create a team, even if you are a hacker working alone.</b></p>
        <div v-if="!currentTeam && !teamCreationLoading" class="create-team-container">
          <form @submit.prevent="goToProfile" class="create-team-form">
            <div class="form-group">
              <div class="input-wrapper">
                <input type="text" class="form-control mx-auto" id="nameInput" placeholder="Enter Team Name" v-model="teamName">
              </div>
            </div>
          </form>
          <Button size="lg" text="Create Team" @click="createTeam()" class="create-team-button"/>
        </div>
        <div v-if="teamCreationLoading">
          <LoadingSpinner />
        </div>
        <div v-else class="team-section">
          <SectionTitle :title="sectionTitle" class="invites-divider"/>
          <b-row v-if="!currentTeam && invites.length === 0" class="pending-invites">
            <span>You have no pending invites!</span>
          </b-row>
          <b-row v-if="!currentTeam && invites.length > 0" class="invite-list">
            {{ invites }}
            <Banner v-for="invite in invites" :text="'You have a pending invite for the team: ' + invite.team_name" :key="invite.id" :displayAcceptButton="true" @accept="acceptInvite(invite)"/>
          </b-row>
          <b-row v-if="currentTeam" class="team-list-container">
            <div v-for="teamMember in currentTeam.members" :key="teamMember.id" class="team-list-item">
              <div class="col-4 team-list-segment">
                <span class="mx-auto">
                  {{ teamMember.full_name }}
                </span>
              </div>
              <div class="col-4 team-list-segment">
                <span class="mx-auto">
                  {{ teamMember.email }}
                </span>
              </div>
              <div class="col-4">
                <span class="mx-auto">
                  {{ teamMember.school }}
                </span>
              </div>
            </div>
            <div v-for="teamMember in invitesToCurrentTeam" :key="teamMember.id" class="team-list-item invited-list-item">
              <div class="col-6">
                <span>
                  {{ teamMember.email }}
                </span>
              </div>
              <div class="col-6">
                <span class="invited-list-pending">
                  PENDING
                </span>
              </div>
            </div>
          </b-row>
        </div>
      </b-container>

      <div v-if="currentTeam && Object.keys(currentTeam['members']).length < 4 && invitesToCurrentTeam.length < 3" class="create-team-container invite-container">
        <form @submit.prevent="inviteHacker" class="create-team-form">
          <div class="row">
            <div class="col-8">
              <input type="email" class="form-control mx-auto" ref="emailInput" placeholder="Enter Hacker Email" v-model="inviteEmail">
            </div>
            <div class="col-4">
              <Button size="lg" text="Invite Hacker" type="submit" @click="inviteHacker()"/>
            </div>
          </div>
        </form>
      </div>
      <div v-if="currentTeam && Object.keys(currentTeam['members']).length >= 4 || invitesToCurrentTeam.length >= 3">
        <span>
          You have reached the maximum team size and cannot add additional members.
          <br>
          <br>
        </span>
      </div>
      <div v-if="currentTeam">
        <Button size="lg" text="Leave Team" @click="leaveTeam()" class="create-team-button" style="background: white !important;" :outlineStyle="true"/>
      </div>
    </div>
    <div v-else>
      <LoadingSpinner />
    </div>
  </div>
</template>

<script>
import SectionTitle from '@/components/SectionTitle.vue';
import Button from '@/components/Button.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import Banner from '@/components/Banner.vue';
import generalMixin from '../mixins/general';
import Config from '../config/general';

export default {
  name: 'Team',
  components: {
    SectionTitle,
    Button,
    Banner,
    LoadingSpinner,
  },
  mixins: [generalMixin],
  data() {
    return {
      teamName: '',
      invites: [],
      invitesToCurrentTeam: [],
      inviteEmail: '',
      currentTeam: null,
      dataLoaded: false,
      teamCreationLoading: false,
      checklistItems: ['submitted my hack on Devpost:', 'signed up for an expo slot to show off my hack:', 'submitted my hack to Technica below:'],
    };
  },
  async mounted() {
    await this.activityTracking('TEAMS');
    await this.getInvitesForHacker();
    await this.getTeam();
    this.dataLoaded = true;
  },
  computed: {
    sectionTitle() {
      return !this.currentTeam ? 'Invites' : this.currentTeam.name;
    },
    teamFormationEventId() {
      const env = this.getCurrentEnvironment();
      return Config[env].eventIds.teamFormation;
    },
  },
  methods: {
    async createTeam() {
      if (this.teamName !== '') {
        this.teamCreationLoading = true;
        const env = this.getCurrentEnvironment();
        const createTeamPostParams = {
          team_name: this.teamName,
          project_submitted: false,
        };
        const createdTeam = await this.performPostRequest(Config[env].TEAMS_BASE_ENDPOINT, env, 'create_team', createTeamPostParams);
        await this.activityTracking('TEAM_CREATION');
        // after creating the new team, join it
        const joinTeamPostParams = {
          team_id: createdTeam.id,
          user_id: this.getUserId(),
        };
        await this.performPostRequest(Config[env].TEAMS_BASE_ENDPOINT, env, 'join_team', joinTeamPostParams);
        await this.getTeam();
        this.$emit('teamMembershipChanged', true);
        this.teamName = '';
        // create checklist items for the team
        await this.createChecklist();
        const teamZoomLink = await this.createZoomLink();
        await this.addZoomLinkForTeam(teamZoomLink);
        this.teamCreationLoading = false;
      }
    },
    async createChecklist() {
      const env = this.getCurrentEnvironment();
      this.checklistItems.forEach(async (item) => {
        const createChecklistPostParams = {
          team_id: this.currentTeam.id,
          checklist_item_id: item,
        };
        await this.performPostRequest(Config[env].SPONSORS_INFO_ENDPOINT, env, 'create_project_checklist_item', createChecklistPostParams);
      });
    },
    async getInvitesForHacker() {
      const params = {
        user_id: this.getUserId(),
      };
      const env = this.getCurrentEnvironment();
      const invites = await this.performGetRequest(Config[env].TEAMS_BASE_ENDPOINT, env, 'get_team_invites', params);
      const formattedInvites = [];
      Object.keys(invites).forEach((k) => {
        formattedInvites[k] = invites[k];
      });

      if (formattedInvites.length > 0) {
        this.invites = formattedInvites;
      }
    },
    async getInvitesForTeam() {
      const params = {
        team_id: this.currentTeam.id,
      };
      const env = this.getCurrentEnvironment();
      const invites = await this.performGetRequest(Config[env].TEAMS_BASE_ENDPOINT, env, 'get_hackers_invited_to_team', params);
      const formattedInvites = [];
      Object.keys(invites).forEach((k) => {
        formattedInvites[k] = invites[k];
      });
      // console.log(formattedInvites);
      if (formattedInvites.length > 0) {
        this.invitesToCurrentTeam = formattedInvites;
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
        this.currentTeam.id = team[0].team_id;
        this.$emit('teamMembershipChanged', true);
        await this.getInvitesForTeam();
      }
    },
    async inviteHacker() {
      const env = this.getCurrentEnvironment();
      if (this.inviteEmail !== '' && this.$refs.emailInput.checkValidity() && !this.inviteExists()) {
        const createTeamPostParams = {
          team_id: this.currentTeam.id,
          email: this.inviteEmail,
          team_name: this.currentTeam.name,
        };
        this.invitesToCurrentTeam.push({ email: this.inviteEmail, id: (new Date()).toString() });
        this.inviteEmail = '';
        await this.performPostRequest(Config[env].TEAMS_BASE_ENDPOINT, env, 'invite_to_team', createTeamPostParams);
      }
    },
    inviteExists() {
      const emailsInvitedOrEnrolled = [];
      this.invitesToCurrentTeam.forEach((invite) => {
        emailsInvitedOrEnrolled.push(invite.email);
      });
      Object.keys(this.currentTeam.members).forEach((k) => {
        emailsInvitedOrEnrolled.push(this.currentTeam.members[k].email);
      });
      return emailsInvitedOrEnrolled.includes(this.inviteEmail);
    },
    async leaveTeam() {
      const env = this.getCurrentEnvironment();
      const params = {
        user_id: this.getUserId(),
      };
      await this.performPostRequest(Config[env].TEAMS_BASE_ENDPOINT, env, 'leave_team', params);
      this.currentTeam = null;
      this.teamName = '';
      this.invites = [];
      this.invitesToCurrentTeam = [];
      this.inviteEmail = '';
      this.$emit('teamMembershipChanged', false);
    },
    async createZoomLink() {
      const env = this.getCurrentEnvironment();
      const params = {
        event_name: 'Technica Team Room',
      };
      const meeting = await this.performPostRequest(Config[env].SCHEDULE_BASE_ENDPOINT, env, 'create_zoom_meeting', params);
      return meeting.zoom_link;
    },
    async addZoomLinkForTeam(link) {
      const env = this.getCurrentEnvironment();
      const params = {
        id: this.currentTeam.id,
        link,
      };
      await this.performPostRequest(Config[env].TEAMS_BASE_ENDPOINT, env, 'add_zoom_link_for_team', params);
    },
    async acceptInvite(invite) {
      this.teamCreationLoading = true;
      const env = this.getCurrentEnvironment();
      const joinTeamPostParams = {
        team_id: invite.team_id,
        user_id: this.getUserId(),
      };
      await this.performPostRequest(Config[env].TEAMS_BASE_ENDPOINT, env, 'join_team', joinTeamPostParams);
      const deleteInviteParams = {
        id: invite.id,
      };
      await this.performPostRequest(Config[env].TEAMS_BASE_ENDPOINT, env, 'delete_team_invite', deleteInviteParams);
      await this.getTeam();
      this.$emit('teamMembershipChanged', true);
      this.teamCreationLoading = false;
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

.team-section {
  padding: 10px;
}

.create-team-container {
  width: 25vw;
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
  min-height: 30vh;
  padding: 20px;
  flex-flow: column;
}

.team-list-item {
  display: flex;
  justify-content: space-around;
  width: 100%;
  height: fit-content;
  padding: 10px;
  border: 1px solid #B6A1C4;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.team-list-segment {
  border-right: 1px solid #B6A1C4;
}

.invite-container {
  margin-bottom: 2rem;
}

.invite-list {
  flex: auto;
  justify-content: center;
  align-items: center;
}

.invited-list-item {
  background: #E5E5E5;
  border: 1px solid #B6A1C4;
}

.invited-list-pending {
  color: #A88AA8 !important;
  font-weight: bold;
}
</style>
