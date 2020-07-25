const AWS = require('aws-sdk');
const UUID = require('uuid');
const withSentry = require("serverless-sentry-lib");
AWS.config.update({region:'us-east-1'});
 
// delete a single user from the database
module.exports.delete_user = withSentry(async event => {
  const body = JSON.parse(event.body);
  const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

  if(!body['id']){
    return{
      statusCode: 500,
      body: "delete_user is missing id"
    }
  }

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
});

// Retrieves a single user from the database
module.exports.get_user = withSentry(async event => {
  const id = String(event.queryStringParameters.id);

  const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

  const item = await ddb.getItem({
    TableName: process.env.USERS_TABLE,
    Key: {
      id: {
        S: id
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
});

//adds a new user to the database
module.exports.add_user = withSentry(async user => {

  const body = JSON.parse(user.body);
  const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

  const id = UUID.v4();
  body.id = id;

  //checks if any field is missing to create a  user
  if (!body["email"] || !body["full_name"] || !body["access_level"] || !body["group"]) {
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
});

// Sends an email invite to a user for registering/logging in
module.exports.invite_user = withSentry(async event => {
  // Lazy load the sendgrid api - we don't want to load it for other endpoints
  const sgMail = require('@sendgrid/mail');

  const body = JSON.parse(event.body);

  // check for id in request
  if (!body.id) {
    return {
      statusCode: 500,
      body: "add_event_to_user_list expects keys \"id\""
    }
  }

  const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

  // Get the user's info to send email and update dbs
  const userResp = await ddb.getItem({
    TableName: process.env.USERS_TABLE,
    Key: {
      id: {
        S: body.id
      }
    }
  }).promise();

  const user = userResp.Item;

  const SecretsManager = new AWS.SecretsManager({ region: 'us-east-1' });
  const SecretsManagerKey = await SecretsManager.getSecretValue({SecretId: process.env.SENDGRID_SECRET_NAME}).promise();
  const decodedSendgridKey = JSON.parse(SecretsManagerKey.SecretString).SENDGRID_API_KEY;

  // TODO: actual invite link logic ----------------------------------//
  invite_link = process.env.BASE_INVITE_URL + "?token=" + user.id.S;  //
  // --------------------------------- TODO: actual invite link logic //

  // Send the user an email, using our template
  sgMail.setApiKey(decodedSendgridKey);

  const msg = {
    from: { email:"tech@gotechnica.org" },
    personalizations: [{
      "to":[{
        "email": user.email.S
      }],
      "dynamic_template_data":{
        "user_name": user.full_name.S,
        "invite_link": invite_link
      }
    }],
    template_id: process.env.INVITE_TEMPLATE_ID
  };
 
  sgMail.send(msg);

  // update ddb table:"platform-users" so user's `registration_status` is "email_invite_sent"
  const updateResp = await ddb.updateItem({
    TableName: process.env.USERS_TABLE,
    Key: { id: { S: user.id.S.toString() } },
    UpdateExpression: "SET registration_status = :s",
    ExpressionAttributeValues: {":s": {"S":"email_invite_sent"}}
  }).promise()

  // new item in "platform-invites" table with pertinent information
  const result = await ddb.putItem({
    TableName: process.env.INVITES_TABLE,
    Item: {
      id: {S: UUID.v4()},
      user_id: {S: user.id.S},
      email: {S: user.email.S},
      invite_link: {S: invite_link},
      timestamp: {S: new Date().toString()},
      accepted: {S: "false"}
    }
  }).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(result.Item),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    }
  };
});

// Updates an existing schedule user in the database
module.exports.update_user = withSentry(async user => {

  const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

  const body = JSON.parse(user.body);

  if (!body["id"]) {
    return {
      statusCode: 500,
      body: "update_user expects key \"id\""
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
      exprAttrValues[':' + ref] = { S: body[k] }
      counter++
    }
  });

  // Remove trailing comma from UpdateExpression
  update = update.slice(0, -1)

  const params = {
    TableName: process.env.USERS_TABLE,
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
});

// Adds a user to banned users table
module.exports.ban_user = withSentry(async event =>{
  const body = JSON.parse(event.body);

  if(!body.id){
    return{
      statusCode: 500,
      body: "ban_user expects keys \"id\""
    };
  }

  const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

  const params = {
    TableName: process.env.BANNED_USERS_TABLE,
    Item: {}
  };
  
  // Dynamically add post request body params to document
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
      'Access-Control-Allow-Credentials': true
    }
  };
});

// Retrieves all users from banned users table
module.exports.get_banned_users = withSentry(async event => {
  const params = {
    TableName: process.env.BANNED_USERS_TABLE
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
});
