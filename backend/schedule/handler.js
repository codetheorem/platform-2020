const AWS = require('aws-sdk');
const UUID = require('uuid');

AWS.config.update({region:'us-east-1'});

// Retrieves the entire list of schedule events from the database
module.exports.get_schedule = async event => {
  var params = {
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
    
// Updates an existing schedule event in the database
module.exports.update_event = async event => {

  const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
    
  const body = JSON.parse(event.body);

  if (!body["id"]) {
    return {
      statusCode: 500,
      body: "update_event expects key \"id\""
    }
  }
    
  id = body['id'];

  // Initialize UpdateExpression for ddb.updateItem()
  let update = 'SET';

  // Initialize ExpressionAttributeNames for ddb.updateItem()
  let exprAttrNames = {};

  // Initialize ExpressionAttributeValues for ddb,updateItem()
  let exprAttrValues = {};

  let counter = 0;
    
  // dynamically update post request body params to document
  Object.keys(body).forEach(k => {
    if (k != 'id') {
      const ref = 'val' + counter;
      let updateElement = ' #' + k + ' =:' + ref + ','
      update = update.concat(updateElement)
      exprAttrNames['#' + k] = k
      exprAttrValues[':' + ref] = {S: body[k]}
      counter++
    }
  });

  // Remove trailing comma from UpdateExpression
  update = update.slice(0, -1)
    
  const params = {
    TableName: process.env.SCHEDULE_TABLE,
    Key: {
      id: {
        S: id.toString()
      }
    },
    UpdateExpression: update,
    ExpressionAttributeNames: exprAttrNames,
    ExpressionAttributeValues: exprAttrValues
  };
    
  // Call DynamoDB to update the item to the table
  const result = await ddb.updateItem(params).promise();
    
  return {
    statusCode: 200,
    body: JSON.stringify(result.Item)
  };
};
