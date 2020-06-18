const AWS = require('aws-sdk');
const UUID = require('uuid');

AWS.config.update({region:'us-east-1'});

// Retrieves the entire list of schedule events from the database
module.exports.get_schedule = async event => {
  const params = {
    TableName: process.env.SCHEDULE_TABLE,
  };

  const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

  const result = await ddb.scan(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(result.Items)
  };
};

// Retrieves a single schedule event from the database
module.exports.get_event = async event => {
  const id = event.queryStringParameters.id;

  const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

  const item = await ddb.getItem({
    TableName: process.env.SCHEDULE_TABLE,
    Key: {
      id: {
        S: id.toString()
      }
    }
  }).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(item.Item)
  };
};

// Adds a new schedule event to the database
module.exports.add_event = async event => {
  const body = JSON.parse(event.body);

  const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

  const id = UUID.v4();

  const params = {
    TableName: process.env.SCHEDULE_TABLE,
    Item: {}
  };

  body.id = id;

  // dynamically add post request body params to document
  Object.keys(body).forEach(k => {
    params.Item[k] = {S: body[k]}
  });

  // Call DynamoDB to add the item to the table
  const result = await ddb.putItem(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(result.Item)
  };
};

// Adds a new schedule event to the a user's list
module.exports.add_event_to_user_list = async event => {
  const body = JSON.parse(event.body);

  if (!body["event_id"] || !body["user_id"]) {
    return {
      statusCode: 500,
      body: "add_event_to_user_list expects keys \"event_id\" and \"user_id\""
    }
  }

  const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

  const id = UUID.v4();

  const params = {
    TableName: process.env.USER_EVENTS_TABLE,
    Item: {
      id: {S: id},
      event_id: {S: body["event_id"]},
      user_id: {S: body["user_id"]}
    }
  };

  // Call DynamoDB to add the item to the table
  const result = await ddb.putItem(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(result.Item)
  };
};
