const db = require("simple-dynamodb");
const AWS = require('aws-sdk');
const uuid = require('uuid');

const TABLE_NAME = 'platform-teams-dev';


module.exports.create_team = async event => {
  const body = JSON.parse(event.body);
  const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

  const params = {
    TableName: TABLE_NAME,
    Item: {
      'id': {S:uuid.v4()},
    },
  };

  // dynamically add post request body params to document
  Object.keys(body).forEach(k => {
    params.Item[k] = {S: body[k]}
  });

  // Call DynamoDB to add the item to the table
  const result = await ddb.putItem(params).promise()

  // return 500 on error
  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };

};
