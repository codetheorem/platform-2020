import Axios from 'axios';
const AWS = require('aws-sdk');

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
        formattedItem[key] = item[key].S;
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
  },
};
