const db = require("simple-dynamodb");
const AWS = require('aws-sdk');

const TABLE_NAME = 'schedule-demo';

AWS.config.update({region:'us-east-1'});

module.exports.get_schedule = async event => {
  var params = {
    TableName: process.env.SCHEDULE_TABLE,
  };

  const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

  const result = await ddb.scan(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(result.Items)
  };
};

module.exports.get_event = async event => {
  const id = event.queryStringParameters.id;

  const item = await db.getItem({
    TableName: TABLE_NAME,
    Key: { id }
  });

  return {
    statusCode: 200,
    body: JSON.stringify(item.Item)
  };
};

module.exports.add_event = async event => {
  const body = JSON.parse(event.body);

  const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

  const params = {
    TableName: process.env.SCHEDULE_TABLE,
    Item: {}
  };

  // dynamically add post request body params to document
  Object.keys(body).forEach(k => {
    params.Item[k] = {S: body[k]}
  });

  // Call DynamoDB to add the item to the table
  const result = await ddb.putItem(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(result.Item)
  };
};