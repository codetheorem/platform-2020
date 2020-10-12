import Axios from 'axios';
import Config from '../config/general';

export default {
  methods: {
    // use this where the get data endpoint uses the AWS Document Client
    // (AKA data is already formatted JSON)
    async getDataSimple(baseUrl, stage, endpoint) {
      try {
        const result = await Axios.get(`${baseUrl}/${stage}/${endpoint}`);
        console.log(result);
        return result.data;
      } catch (e) {
        console.error(e);
        return null;
      }
    },
    async getData(baseUrl, stage, endpoint) {
      try {
        const result = await Axios.get(`${baseUrl}/${stage}/${endpoint}`);
        console.log(result);
        return this.processDynamoResponse(result.data);
      } catch (e) {
        console.error(e);
        return null;
      }
    },
    processDynamoResponse(rawResponse) {
      return rawResponse.map((item) => this.formatDynamoItem(item));
    },
    formatDynamoItem(item) {
      const formattedItem = {};
      Object.keys(item).forEach((key) => {
        formattedItem[key] = item[key];
      });
      return formattedItem;
    },
    async performGetRequest(baseUrl, stage, endpoint, params) {
      try {
        const result = await Axios.get(`${baseUrl}/${stage}/${endpoint}`, { params });
        return this.formatDynamoItem(result.data);
      } catch (e) {
        console.error(e);
        return null;
      }
    },
    async performPostRequest(baseUrl, stage, endpoint, params) {
      try {
        const result = await Axios.post(`${baseUrl}/${stage}/${endpoint}`, params);
        return result.data;
      } catch (e) {
        console.error(e);
        return null;
      }
    },
    getUserId() {
      return this.$cookie.get('userId');
    },
    setUserIdCookie(id) {
      this.$cookie.set('userId', id, 100);
    },
    removeUserIdCookie() {
      this.$cookie.delete('userId');
    },
    getUserName() {
      return this.$cookie.get('userName');
    },
    setUserNameCookie(name) {
      this.$cookie.set('userName', name, 100);
    },
    removeUserNameCookie() {
      this.$cookie.delete('userName');
    },
    getUserGroup() {
      return this.$cookie.get('group') || 'hacker';
    },
    setUserGroupCookie(group) {
      this.$cookie.set('group', group, 100);
    },
    removeUserGroupCookie() {
      this.$cookie.delete('group');
    },
    getSponsorBoothId() {
      return this.$cookie.get('sponsorBoothId');
    },
    setSponsorBoothIdCookie(id) {
      this.$cookie.set('sponsorBoothId', id, 100);
    },
    removeSponsorBoothIdCookie() {
      this.$cookie.delete('sponsorBoothId');
    },
    async checkIfUserHasTeam() {
      const env = this.getCurrentEnvironment();
      const teamParams = {
        user_id: this.getUserId(),
      };
      const team = await this.performGetRequest(Config[env].TEAMS_BASE_ENDPOINT, env, 'get_team_membership_for_user', teamParams);
      if (team[0]) {
        return true;
      }
      return false;
    },
    getCurrentEnvironment() {
      if (window.location.hostname === 'platform.gotechnica.org') {
        return 'prod';
      }
      if (window.location.hostname === 'platform-staging.gotechnica.org') {
        return 'stage';
      }
      return 'dev';
    },
    async activityTracking(actionName) {
      const env = this.getCurrentEnvironment();
      const params = {
        user_id: this.getUserId(),
        action: actionName,
        user_name: this.getUserName(),
      };
      await this.performPostRequest(Config[env].USERS_BASE_ENDPOINT, env, 'track_user_activity', params);
    },
    getDayOfTheWeek(date) {
      const weekday = new Array(7);
      weekday[0] = 'Sunday';
      weekday[1] = 'Monday';
      weekday[2] = 'Tuesday';
      weekday[3] = 'Wednesday';
      weekday[4] = 'Thursday';
      weekday[5] = 'Friday';
      weekday[6] = 'Saturday';
      return weekday[date.getDay()];
    },
    formatAMPM(date) {
      let hours = date.getHours();
      let minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'pm' : 'am';
      hours %= 12;
      hours = hours || 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? `0${minutes}` : minutes;
      return `${hours}:${minutes} ${ampm}`;
    },
    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
    async setUserSlackId(email = null) {
      const env = this.getCurrentEnvironment();
      const user = await this.performGetRequest(Config[env].USERS_BASE_ENDPOINT, env, 'get_user', { id: this.getUserId() });
      if (!user.slack_id) {
        const slackId = await this.performGetRequest(Config[env].PROJECTS_BASE_ENDPOINT, env, 'lookup_user_slack_id_by_email', { email: email || user.email });
        if (slackId.user) {
          const rawSlackId = slackId.user.id;
          await this.performPostRequest(Config[env].USERS_BASE_ENDPOINT, env, 'update_user', { id: this.getUserId(), slack_id: rawSlackId });
          return true;
        }
      } else {
        return true;
      }
      return false;
    },
  },
};
