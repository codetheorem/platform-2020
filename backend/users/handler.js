const AWS = require('aws-sdk');
const UUID = require('uuid');

AWS.config.update({ region: 'us-east-1' });

// delete a single user from the database
module.exports.delete_user = async event => {
  const body = JSON.parse(event.body);
  const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

  const delete_params = {
    TableName: process.env.USERS_TABLE,
    Key: {
      'id': { S: body['id'] },
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

  const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

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

//adds a new user to the database
module.exports.add_user = async user => {

  const body = JSON.parse(user.body);
  const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

  const id = UUID.v4();
  body.id = id;

  //checks if any field is missing to create a  user
  if (!body["email"] || !body["full_name"] || !body["access_level"]) {
    return {
      statusCode: 500,
      body: "add_user is missing a field"
    }
  }

  const params = {
    TableName: process.env.USERS_TABLE,
    Item: {}
  };

  // dynamically add post request body params to document
  Object.keys(body).forEach(k => {
    params.Item[k] = { S: body[k] }
  });

  // Call DynamoDB to add the item to the table
  const result = await ddb.putItem(params).promise();

  // Returns status code 200 and JSON string of 'result'
  return {
    statusCode: 200,
    body: JSON.stringify(params.Item),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    }
  };
};
