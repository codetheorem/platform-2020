import Axios from 'axios';

export default {
    methods: {
        async getData(baseUrl, stage, endpoint) {
            try {
                const result = await Axios.get(`${baseUrl}/${stage}/${endpoint}`);
                return this.processDynamoResponse(result.data);
            } catch (e) {
                console.error(e);
            }
        },
        processDynamoResponse(rawResponse) {
            return rawResponse.map(item => {
                const formattedItem = {};
                Object.keys(item).map(key => {
                    formattedItem[key] = item[key].S;
                });
                return formattedItem;
            });
        }
    }
}