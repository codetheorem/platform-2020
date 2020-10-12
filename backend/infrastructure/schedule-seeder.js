const Axios = require('axios');

var csv = require("csvtojson");

const endpoint = "https://god5dseh2k.execute-api.us-east-1.amazonaws.com/prod3/add_event";

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }  

// Convert a csv file with csvtojson
csv()
  .fromFile('./schedule_sample_data.csv')
  .then(async (csvResult) => { 
    const formattedScheduleItems = csvResult.map(item => {
        delete item.id;
        delete item.link;
        return item;
    });
    for (const item of formattedScheduleItems) {
        await Axios.post(endpoint, item);
        await sleep(1000);
      }
   })