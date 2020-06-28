const AWS = require('aws-sdk');

  // delete a single user from the database
module.exports.delete_user = async event => {
  const body = JSON.parse(event.body);
  const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

  const delete_params = {
    TableName: process.env.USERS_TABLE,
    Key: {
      'id': {S: body['id']},
    },
  };
  
  const status_result = await ddb.deleteItem(delete_params).promise();

  // return 500 on error
  return {
    statusCode: 200,
    body: JSON.stringify(status_result.Item),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    }
  };
};

// Retrieves a single user from the database
module.exports.get_user = async event => {
  const id = event.queryStringParameters.id;

  const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

  const item = await ddb.getItem({
    TableName: process.env.USERS_TABLE,
    Key: {
      id: {
        S: id.toString()
      }
    }
  }).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(item.Item),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    }
  };
};