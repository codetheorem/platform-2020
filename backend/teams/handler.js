const db = require("simple-dynamodb");
const AWS = require('aws-sdk');
const uuid = require('uuid');

const TEAMS_TABLE_NAME = 'platform-teams-dev';
const INVITES_TABLE_NAME = 'platform-team-invites';
const MEMBERSHIPS_TABLE_NAME = 'platform-team-memberships';

async function post_body_to_table(event, table_name) {
  const body = JSON.parse(event.body);
  const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

  const params = {
    TableName: table_name,
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

module.exports.create_team = async event => {
  return post_body_to_table(event, TEAMS_TABLE_NAME);
};

module.exports.invite_to_team = async event => {
  return post_body_to_table(event, INVITES_TABLE_NAME);
};

module.exports.join_team = async event => {
  return post_body_to_table(event, MEMBERSHIPS_TABLE_NAME);
};

module.exports.leave_team = async event => {
  const body = JSON.parse(event.body);
  const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

  // Call DynamoDB to delete the item
  const delete_params = {
    TableName: MEMBERSHIPS_TABLE_NAME,
    Key: {
      'id': {S: body['id']},
    },
  };
  
  const status_result = await ddb.deleteItem(delete_params).promise();

  // return 500 on error
  return {
    statusCode: 200,
    body: JSON.stringify(status_result),
  };
};