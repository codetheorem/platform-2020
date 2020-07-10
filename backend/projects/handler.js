const AWS = require('aws-sdk');
const UUID = require('uuid');
const withSentry = require("serverless-sentry-lib");

AWS.config.update({region:'us-east-1'});



// Retrieves all sponsors from the database
module.exports.get_sponsorship_info = withSentry(async event => {
  const params = {
    TableName: process.env.SPONSORS_INFO_TABLE,
  };

  // using DocumentClient auto parses the output into nice JSON!
  const ddb = new AWS.DynamoDB.DocumentClient();

  const result = await ddb.scan(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(result.Items),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    }
  };
});


// Adds a new sponsor to the database
module.exports.add_sponsor = withSentry(async event => {
  const body = JSON.parse(event.body);

  // use DocumentClient, which supports easily written db operations
  const ddb = new AWS.DynamoDB.DocumentClient();

  const id = UUID.v4();

  const params = {
    TableName: process.env.SPONSORS_INFO_TABLE,
    Item: {}
  };

  body.id = id;

  // dynamically add post request body params to document
  Object.keys(body).forEach(k => {
      params.Item[k] = body[k]
  });

  // Call DynamoDB to add the item to the table
  const result = await ddb.put(params).promise();

  // remove {S: <value>} format returned by AWS
  const reply = result.Item;
  Object.keys(reply).forEach(k => {
      reply[k] = reply[k]["S"]
  });

  return {
    statusCode: 200,
    body: JSON.stringify(reply),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    }
  };
});
