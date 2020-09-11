const AWS = require('aws-sdk');
const UUID = require('uuid');
const withSentry = require('serverless-sentry-lib');

AWS.config.update({ region: 'us-east-1' });

// Posts activity data to the activity table for tracking purposes
module.exports.track_user_activity = withSentry(async (action) => {
  const body = JSON.parse(action.body);
  const ddb = new AWS.DynamoDB.DocumentClient();

  const activityId = UUID.v4();

  if (!body.user_id || !body.action) {
    return {
      statusCode: 500,
      body: 'track_user_activity is missing user_id or action',
    };
  }

  const params = {
    TableName: process.env.ACTIVITY_TABLE,
    Item: {
      id: activityId,
      user_id: body.user_id,
      event: body.action,
      timestamp: new Date().toString(),
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
