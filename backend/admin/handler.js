const AWS = require('aws-sdk');
const withSentry = require('serverless-sentry-lib');
const UUID = require('uuid');

const TOTAL_EASTER_EGGS = 6;

AWS.config.update({ region: 'us-east-1' });

module.exports.get_user_shortlink_clicks = withSentry(async (event) => {
  if (!event.queryStringParameters || !event.queryStringParameters.user_id) {
    return {
      statusCode: 500,
      body: 'get_user_shortlink_clicks expects key "user_id"',
    };
  }

  const userId = event.queryStringParameters.user_id;
  const ddb = new AWS.DynamoDB.DocumentClient();

  const params = {
    TableName: process.env.EASTER_EGGS_TABLE,
    FilterExpression: 'user_id = :val',
    ExpressionAttributeValues: {
      ':val': userId,
    },
  };

  const result = await ddb.scan(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(result.Items),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
  };
});

// Adds a new shortlink click event to the database
module.exports.add_easter_eggs_for_user = withSentry(async (event) => {
  const body = JSON.parse(event.body);

  const ddb = new AWS.DynamoDB.DocumentClient();

  let count = 1;
  while (count <= TOTAL_EASTER_EGGS) {
    const id = UUID.v4();
    const params = {
      TableName: process.env.EASTER_EGGS_TABLE,
      Item: {
        id,
        user_id: body.user_id,
        easter_egg_id: count,
        discovered: false,
      },
    };
    // eslint-disable-next-line no-await-in-loop
    await ddb.put(params).promise();
    count += 1;
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ count }),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
  };
});

module.exports.discover_easter_egg = withSentry(async (event) => {
  const ddb = new AWS.DynamoDB.DocumentClient();
  const body = JSON.parse(event.body);
  if (!body.user_id || !body.id) {
    return {
      statusCode: 500,
      body: 'Missing user_id or id keys',
    };
  }

  const params = {
    TableName: process.env.EASTER_EGGS_TABLE,
    Key: {
      id: body.id,
    },
    UpdateExpression: 'set discovered = :p',
    ExpressionAttributeValues: {
      ':p': true,
    },
    ReturnValues: 'UPDATED_NEW',
  };

  const result = await ddb.update(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(result.Item),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
  };
});
