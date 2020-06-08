const db = require("simple-dynamodb");
const AWS = require('aws-sdk');

const TABLE_NAME = 'schedule-demo';

module.exports.get_schedule = async event => {
  const result = await db.scanItems({
    TableName: TABLE_NAME
  });

  return {
    statusCode: 200,
    body: JSON.stringify(result.Items)
  };
};

module.exports.get_event = async event => {
  const id = event.queryStringParameters.id || "1";

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
    TableName: TABLE_NAME,
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
    body: JSON.stringify(result)
  };
};