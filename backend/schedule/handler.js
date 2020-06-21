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
      body: "add_event_to_user_list expects keys \"id\""
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

  // Call DynamoDB to add the item to the table
  const result = await ddb.deleteItem(params).promise();

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    }
  };
};



function make_shortlink(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// Creates and adds a new unique shortlink to the database, checking for duplicates
module.exports.add_shortlink = async event => {
  const body = JSON.parse(event.body);

  const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
  const id = UUID.v4();
  let shortlink;
  let checker_result;
  let checker_params;
  //check that shortlink is unique
  do {
    shortlink = make_shortlink(6);

    checker_params = {
      ExpressionAttributeValues: {
       ":a": {
         S: shortlink
        }
      }, 
      FilterExpression: "shortlink = :a", 
      TableName: process.env.SHORTLINKS_TABLE
     };
  
    checker_result = await ddb.scan(checker_params).promise();
  } while (checker_result["Count"] > 0);

  // add shortlink
  const params = {
    TableName: process.env.SHORTLINKS_TABLE,
    Item: {}
  };

  body.id = id;
  body.shortlink = shortlink;

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

// Retrieves a single shortlink from the database
module.exports.get_shortlink = async event => {
  const id = event.queryStringParameters.id;

  const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

  const item = await ddb.getItem({
    TableName: process.env.SHORTLINKS_TABLE,
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
