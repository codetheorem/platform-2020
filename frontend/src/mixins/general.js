import Axios from 'axios';
import Config from '../config/general';

export default {
  methods: {
    // use this where the get data endpoint uses the AWS Document Client
    // (AKA data is already formatted JSON)
    async getDataSimple(baseUrl, endpoint) {
      const stage = this.getCurrentEnvironment();
      try {
        const result = await Axios.get(`${baseUrl}/${stage}/${endpoint}`);
        console.log(result);
        return result.data;
      } catch (e) {
        console.error(e);
        return null;
      }
    },
    async getData(baseUrl, endpoint) {
      const stage = this.getCurrentEnvironment();
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
    async performGetRequest(baseUrl, endpoint, params) {
      const stage = this.getCurrentEnvironment();
      try {
        const result = await Axios.get(`${baseUrl}/${stage}/${endpoint}`, { params });
        return this.formatDynamoItem(result.data);
      } catch (e) {
        console.error(e);
        return null;
      }
    },
    async performPostRequest(baseUrl, endpoint, params) {
      const stage = this.getCurrentEnvironment();
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
      const teamParams = {
        user_id: this.getUserId(),
      };
      const team = await this.performGetRequest(this.getEnvVariable('TEAMS_BASE_ENDPOINT'), 'get_team_membership_for_user', teamParams);
      if (team && team[0]) {
        return true;
      }
      return false;
    },
    getCurrentEnvironment() {
      return 'prod2';
      if (window.location.hostname === 'platform.gotechnica.org') {
        return 'prod';
      }
      if (window.location.hostname === 'platform-staging.gotechnica.org') {
        return 'stage';
      }
      if (window.location.hostname === 'htm.gotechnica.org' || window.location.hostname === 'd1pidxtn9bq8br.cloudfront.net' || window.location.hostname === 'hackthemountains.com') {
        return 'prod2';
      }
      return 'dev';
    },
    getEnvVariable(variableName) {
      if (Config.prod2[variableName]) {
        return Config.prod2[variableName];
      }
      if (Config.technica[variableName]) {
        // return Config.technica[variableName];
      }
      if (Config.shared[variableName]) {
        return Config.shared[variableName];
      }
      return Config[this.getCurrentEnvironment()][variableName];
    },
    async activityTracking(actionName) {
      const params = {
        user_id: this.getUserId(),
        action: actionName,
        user_name: this.getUserName(),
      };
      await this.performPostRequest(this.getEnvVariable('USERS_BASE_ENDPOINT'), 'track_user_activity', params);
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
  },
};
