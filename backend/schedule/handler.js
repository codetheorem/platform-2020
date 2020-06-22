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
    body: JSON.stringify(result.Items),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    }
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
    body: JSON.stringify(item.Item),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    }
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
    body: JSON.stringify(result.Item),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    }
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
    body: JSON.stringify(result.Item),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    }
  };
};

// Deletes an existing schedule event in the database
module.exports.delete_event_from_schedule = async event => {
  const body = JSON.parse(event.body);

  const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
    
  if (!body.id) {
    return {
      statusCode: 500,
      body: "delete_event_from_schedule expects key \"id\""
    }
  }

  const params = {
    TableName: process.env.SCHEDULE_TABLE,
    Key: {
      id: {S: body.id},
    }
  };

  // Call DynamoDB to delete the item in the table
  const result = await ddb.deleteItem(params).promise();

  return {
    statusCode: 200
  };
}

// Adds a new schedule event to the a user's list
module.exports.add_event_to_user_list = async event => {
  const body = JSON.parse(event.body);

  if (!body.event_id || !body.user_id) {
    return {
      statusCode: 500,
      body: "add_event_to_user_list expects keys \"event_id\" and \"user_id\""
    }
  }

  const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

  const id = body.user_id + "-" + body.event_id;

  const params = {
    TableName: process.env.USER_EVENTS_TABLE,
    Item: {
      id: {S: id},
      event_id: {S: body.event_id},
      user_id: {S: body.user_id}
    }
  };

  // Call DynamoDB to add the item to the table
  const result = await ddb.putItem(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify({id: id}),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    }
  };
};

// Deletes a schedule event from a user's list
module.exports.delete_event_from_user_list = async event => {
  const body = JSON.parse(event.body);

  // Check for validity
  if (!body.id) {
    return {
      statusCode: 500,
      body: "delete_event_from_user_list expects keys \"id\""
    }
  }

  // Vars to be used later (db instance)
  const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

  const params = {
    TableName: process.env.USER_EVENTS_TABLE,
    Key: {
      id: {S: body.id},
    }
  };

  // Call DynamoDB to delete the item from the table
  const result = await ddb.deleteItem(params).promise();

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    }
  };
};

// Retrieves all schedule events added to the user's list
module.exports.get_events_from_user_list = async event => {
  // Check for validity
  if (!event.queryStringParameters || !event.queryStringParameters.user_id) {
    return {
      statusCode: 500,
      body: "get_events_from_user_list expects key \"user_id\""
    }
  }

  // Vars to be used later (db instance)
  const user_id = event.queryStringParameters.user_id;
  const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

  const params = {
    TableName: process.env.USER_EVENTS_TABLE,
    FilterExpression: "user_id = :val",
    ExpressionAttributeValues: {
      ":val" : {S: user_id},
    }
  };

  // Call DynamoDB to scan through *all* items in the table
  const result = await ddb.scan(params).promise();

  // Instead of just returning the ddb response, let's clean things up
  const response = {
    user_id: user_id,
    event_ids: []
  };

  result.Items.forEach(k => {
    response.event_ids.push(k.event_id.S)
  });

  return {
    statusCode: 200,
    body: JSON.stringify(response),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    }
  };
};
