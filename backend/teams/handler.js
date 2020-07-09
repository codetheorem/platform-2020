const AWS = require('aws-sdk');
const UUID = require('uuid');

AWS.config.update({region:'us-east-1'});

// Posts the request body fields to a DynamoDB table
post_request_body_to_table = async (event, table_name) => {
  const body = JSON.parse(event.body);
  const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

  const params = {
    TableName: table_name,
    Item: {}
  };

  const id = UUID.v4();
  body.id = id;

  // dynamically add post request body params to document
  Object.keys(body).forEach(k => {
    params.Item[k] = {S: body[k]}
  });

  // Call DynamoDB to add the item to the table
  const result = await ddb.putItem(params).promise()

  // remove {S: <value>} format returned by AWS
  const reply = result.Item;
  Object.keys(reply).forEach(k => {
      reply[k] = reply[k]["S"]
  });

  // return 500 on error
  return {
    statusCode: 200,
    body: JSON.stringify(reply),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    }
  };
};

module.exports.create_team = async event => {
  return post_request_body_to_table(event, process.env.TEAMS_TABLE);
};

module.exports.invite_to_team = async event => {
  return post_request_body_to_table(event, process.env.INVITES_TABLE);
};

module.exports.join_team = async event => {
  return post_request_body_to_table(event, process.env.MEMBERSHIPS_TABLE);
};

module.exports.leave_team = async event => {
  const body = JSON.parse(event.body);
  const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

  // Call DynamoDB to delete the item
  const delete_params = {
    TableName: process.env.MEMBERSHIPS_TABLE,
    Key: {
      'id': {S: body['id']},
    },
  };
  
  const status_result = await ddb.deleteItem(delete_params).promise();

  // return 500 on error
  return {
    statusCode: 200,
    body: JSON.stringify(status_result),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    }
  };
};