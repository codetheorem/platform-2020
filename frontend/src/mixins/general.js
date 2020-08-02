import Axios from 'axios';

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
    getCurrentEnvironment() {
      if (window.location.hostname === 'platform.gotechnica.org') {
        return 'production';
      }
      if (window.location.hostname === 'platform-staging.gotechnica.org') {
        return 'stage';
      }
      return 'dev';
    },
  },
};
