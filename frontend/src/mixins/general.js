import Axios from 'axios';
const AWS = require('aws-sdk');

export default {
  methods: {
    async getDataSimple(baseUrl, stage, endpoint) {
      try {
        const result = await Axios.get(`${baseUrl}/${stage}/${endpoint}`);
        console.log(result);
        return result.data;
      } catch (e) {
        console.error(e);
      }
    },
    async getData(baseUrl, stage, endpoint) {
      try {
        const result = await Axios.get(`${baseUrl}/${stage}/${endpoint}`);
        console.log(result);
        return this.processDynamoResponse(result.data);
      } catch (e) {
        console.error(e);
      }
    },
    processDynamoResponse(rawResponse) {
      return rawResponse.map((item) => {
        return this.formatDynamoItem(item);
      });
    },
    formatDynamoItem(item) {
      const formattedItem = {};
        Object.keys(item).map((key) => {
          formattedItem[key] = item[key].S;
        });
      return formattedItem;
    },
    async performGetRequest(baseUrl, stage, endpoint, params) {
      try {
        const result = await Axios.get(`${baseUrl}/${stage}/${endpoint}`, {params});
        return this.formatDynamoItem(result.data);
      } catch (e) {
        console.error(e);
      }
    },
    async performPostRequest(baseUrl, stage, endpoint, params) {
      try {
        const result = await Axios.post(`${baseUrl}/${stage}/${endpoint}`, params);
        return result.data;
      } catch (e) {
        console.error(e);
      }
    },
    getUserId() {
      return this.$cookie.get('userId');
    },
    setUserIdCookie(id) {
      this.$cookie.set('userId', id, 100);
    }
  },
};
