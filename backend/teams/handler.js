const db = require("simple-dynamodb");
const AWS = require('aws-sdk');
const uuid = require('uuid');

const TEAMS_TABLE_NAME = 'platform-teams-dev';
const INVITES_TABLE_NAME = 'platform-team-invites';


module.exports.create_team = async event => {
  const body = JSON.parse(event.body);
  const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

  const params = {
    TableName: TEAMS_TABLE_NAME,
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

module.exports.invite_to_team = async event => {
  const body = JSON.parse(event.body);
  const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

  const params = {
    TableName: INVITES_TABLE_NAME,
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
