const AWS = require('aws-sdk');
const UUID = require('uuid');
const withSentry = require("serverless-sentry-lib");

AWS.config.update({ region: 'us-east-1' });
 
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

  return {
    statusCode: 200,
    body: JSON.stringify(params.Item),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    }
  };
});

// adds a new mentorship request to the database
module.exports.create_mentorship_request = withSentry(async request => {

  const body = JSON.parse(request.body);
  const ddb = new AWS.DynamoDB.DocumentClient();
  const id = UUID.v4();
  body.id = id;

  //checks if any field is missing to create a request
  if (!body["title"] || !body["description"] || !body["category"]) {
    return {
      statusCode: 500,
      body: "create_mentorship_request is missing a field"
    }
  }

  const params = {
    TableName: process.env.MENTORSHIP_REQUESTS_TABLE,
    Item: {}
  };

  // dynamically add post request body params to document
  Object.keys(body).forEach(k => {
    params.Item[k] = body[k]
  });

  // Call DynamoDB to add the item to the table
  const result = await ddb.put(params).promise();

  // Returns status code 200 and JSON string of 'result'
  return {
    statusCode: 200,
    body: JSON.stringify(params.Item),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    }
  };
});

// Retrieves all active mentorship requests from the database
module.exports.get_active_mentorship_requests = withSentry(async event => {
  const params = {
    TableName: process.env.MENTORSHIP_REQUESTS_TABLE,
    KeyConditionExpression: "active = true",
  };

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

// update a mentorship request
module.exports.update_mentorship_request = withSentry(async event => {

  const body = JSON.parse(event.body);

  // dynamically add body params to update request 
  // this assumes body params are flat, AKA no dicts/lists inside
  // use an attribute map to avoid a name conflict with reserved keywords
  // atm only supports 52 attribute mappings
  let update_expression = "set ";
  let attribute_map = {};
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let cur_char_index = 0;
  let charactersLength = characters.length;

  Object.keys(body).forEach(k => {

    if (k != 'id') {
      if (cur_char_index < charactersLength) {
        let attr = characters.charAt(cur_char_index);
        cur_char_index += 1;
        attribute_map[`:${attr}`] = body[k];
        update_expression += `${k} = :${attr}, `;
      } else {
        throw "attribute placeholders exhausted (num of attributes is >52).";
      }
    }
  });
  update_expression = update_expression.slice(0, -2);;

  const params = {
    TableName: process.env.MENTORSHIP_REQUESTS_TABLE,
    Key:{
      "id": body['id'],
    },
    UpdateExpression: update_expression,
    ExpressionAttributeValues: attribute_map,
    ReturnValues:"UPDATED_NEW" // return updated attributes
  };

  const ddb = new AWS.DynamoDB.DocumentClient();

  const result = await ddb.update(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(result.Items),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    }
  };
});

// Retrieves mentorship requests by a user from the database
module.exports.get_user_mentorship_requests = withSentry(async event => {

  const user_id = event.queryStringParameters.user_id;

  const params = {
    TableName: process.env.MENTORSHIP_REQUESTS_TABLE,
    FilterExpression: "user_id = :user_id",
    ExpressionAttributeValues: {
      ":user_id": user_id,
    }
  };

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

// adds a new project submission checklist item to the database
module.exports.create_project_checklist_item = withSentry(async request => {

  const body = JSON.parse(request.body);
  const ddb = new AWS.DynamoDB.DocumentClient();
  
  //checks if any field is missing to create a request
  if (!body["team_id"] || !body["checklist_item_id"]) {
    return {
      statusCode: 500,
      body: "create_project_checklist_item is missing a field"
    }
  }

  body["id"] = UUID.v4();
  body["is_checked"] = false;
  
  const params = {
    TableName: process.env.PROJECT_SUBMISSION_CHECKLIST_ITEMS_TABLE,
    Item: {}
  };

  // dynamically add post request body params to document
  Object.keys(body).forEach(k => {
    params.Item[k] = body[k]
  });

  // Call DynamoDB to add the item to the table
  const result = await ddb.put(params).promise();

  // Returns status code 200 and JSON string of 'result'
  return {
    statusCode: 200,
    body: JSON.stringify(params.Item),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    }
  };
});

// gets a project submission checklist item from the database, matching a team id
module.exports.get_project_checklist_item = withSentry(async event => {

  const team_id = event.queryStringParameters.team_id;

  const params = {
    TableName: process.env.PROJECT_SUBMISSION_CHECKLIST_ITEMS_TABLE,
    FilterExpression: "team_id = :team_id",
    ExpressionAttributeValues: {
      ":team_id": team_id,
    }
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

// updates an existing project submission checklist item in the database
module.exports.update_project_checklist_item = withSentry(async event => {

  const ddb = new AWS.DynamoDB.DocumentClient();
    
  const body = JSON.parse(event.body);

  if (!body["id"]) {
    return {
      statusCode: 500,
      body: "update_project_checklist_item expects key \"id\""
    }
  }
    
  id = body['id'];

  // Initialize UpdateExpression for ddb.update()
  let update = 'SET';

  // Initialize ExpressionAttributeNames for ddb.update()
  let exprAttrNames = {};

  // Initialize ExpressionAttributeValues for ddb,updateItem()
  let exprAttrValues = {};

  let counter = 0;
    
  // dynamically update post request body params to document
  Object.keys(body).forEach(k => {
    if (k != 'id') {
      const ref = 'val' + counter;
      let updateElement = ' #' + k + ' =:' + ref + ',';
      update = update.concat(updateElement);
      exprAttrNames['#' + k] = k;
      exprAttrValues[':' + ref] = body[k];
      counter++;
    }
  });

  // Remove trailing comma from UpdateExpression
  update = update.slice(0, -1);
    
  const params = {
    TableName: process.env.PROJECT_SUBMISSION_CHECKLIST_ITEMS_TABLE,
    Key: {
      id: id.toString()
    },
    UpdateExpression: update,
    ExpressionAttributeNames: exprAttrNames,
    ExpressionAttributeValues: exprAttrValues
  };
    
  // Call DynamoDB to update the item to the table
  const result = await ddb.update(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(result),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    }
  };
});