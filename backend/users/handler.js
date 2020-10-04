const AWS = require('aws-sdk');
const UUID = require('uuid');
const withSentry = require('serverless-sentry-lib');
const sgMail = require('@sendgrid/mail');
const { IncomingWebhook } = require('@slack/webhook');

const TESTING_STAGE = 'testing';
const ADD_USER_EVENT = 'REGISTER';
const INVITE_USER_EVENT = 'LOGIN';

AWS.config.update({ region: 'us-east-1' });

// delete a single user from the database
module.exports.delete_user = withSentry(async (event) => {
  const body = JSON.parse(event.body);
  const ddb = new AWS.DynamoDB.DocumentClient();

  if (!body.id) {
    return {
      statusCode: 500,
      body: 'delete_user is missing id',
    };
  }

  const deleteParams = {
    TableName: process.env.USERS_TABLE,
    Key: { id: body.id },
  };

  const statusResult = await ddb.delete(deleteParams).promise();

  // return 500 on error
  return {
    statusCode: 200,
    body: JSON.stringify(statusResult.Item),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
  };
});

// Retrieves a single user from the database
module.exports.get_user = withSentry(async (event) => {
  const id = String(event.queryStringParameters.id);

  const ddb = new AWS.DynamoDB.DocumentClient();

  const item = await ddb.get({
    TableName: process.env.USERS_TABLE,
    Key: { id },
  }).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(item.Item),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
  };
});

const inviteUserHelper = async (body) => {
  const ddb = new AWS.DynamoDB.DocumentClient();

  // Get the user's info to send email and update dbs
  const userResp = await ddb.get({
    TableName: process.env.USERS_TABLE,
    Key: { id: body.id },
  }).promise();

  const user = userResp.Item;

  const SecretsManager = new AWS.SecretsManager({ region: 'us-east-1' });
  const SecretsManagerKey = await SecretsManager.getSecretValue(
    { SecretId: process.env.SENDGRID_SECRET_NAME },
  ).promise();

  const decodedSendgridKey = JSON.parse(SecretsManagerKey.SecretString).SENDGRID_API_KEY;

  // TODO: actual invite link logic ----------------------------------//
  const inviteLink = `${process.env.BASE_INVITE_URL}?token=${user.id}`; //
  // --------------------------------- TODO: actual invite link logic //

  // Send the user an email, using our template
  sgMail.setApiKey(decodedSendgridKey);

  const msg = {
    from: { email: 'tech@gotechnica.org' },
    personalizations: [{
      to: [{
        email: user.email,
      }],
      dynamic_template_data: {
        user_name: user.full_name || 'there',
        invite_link: inviteLink,
      },
    }],
    template_id: process.env.INVITE_TEMPLATE_ID,
  };

  // If not running integration suites, send email to user
  if (process.env.STAGE !== TESTING_STAGE) {
    await sgMail.send(msg);
  }

  // We can set a flag in the body to not update their registration
  // status if they're just logging back in
  if (body.setRegistrationStatus) {
    // update ddb table:"platform-users" so user's
    // `registration_status` is "email_invite_sent"
    await ddb.update({
      TableName: process.env.USERS_TABLE,
      Key: { id: user.id.toString() },
      UpdateExpression: 'SET registration_status = :s',
      ExpressionAttributeValues: { ':s': 'email_invite_sent' },
    }).promise();
  }

  // new item in "platform-invites" table with pertinent information
  const result = await ddb.put({
    TableName: process.env.INVITES_TABLE,
    Item: {
      id: UUID.v4(),
      user_id: user.id,
      email: user.email,
      invite_link: inviteLink,
      timestamp: new Date().toString(),
      accepted: 'false',
    },
  }).promise();

  return result.Item;
};

// adds a new user to the database
module.exports.add_user = withSentry(async (user) => {
  const body = JSON.parse(user.body);
  const ddb = new AWS.DynamoDB.DocumentClient();

  const id = UUID.v4();
  body.id = id;

  // checks if any field is missing to create a  user
  if (!body.email
   || !body.access_level
   || !body.group) {
    return {
      statusCode: 500,
      body: 'add_user is missing a field',
    };
  }

  const params = {
    TableName: process.env.USERS_TABLE,
    Item: {},
  };

  // dynamically add post request body params to document
  Object.keys(body).forEach((k) => {
    params.Item[k] = body[k];
  });

  // Call DynamoDB to add the item to the table
  await ddb.put(params).promise();

  // Create parameters for activity item
  const activityId = UUID.v4();

  const activityParams = {
    TableName: process.env.ACTIVITY_TABLE,
    Item: {
      id: activityId,
      user_id: body.id,
      event: ADD_USER_EVENT,
      timestamp: new Date().toString(),
    },
  };

  // Call DynamoDB to add activity item to the table
  await ddb.put(activityParams).promise();

  body.setRegistrationStatus = true;

  // Send the user an invite email
  await inviteUserHelper(body);

  // Returns status code 200 and JSON string of 'result'
  return {
    statusCode: 200,
    body: JSON.stringify(params.Item),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
  };
});

module.exports.find_user_by_email = withSentry(async (event) => {
  const email = String(event.queryStringParameters.email);

  // check for email in request
  if (!email) {
    return {
      statusCode: 500,
      body: 'find_user_by_email expects keys "email"',
    };
  }

  const ddb = new AWS.DynamoDB.DocumentClient();

  const params = {
    TableName: process.env.USERS_TABLE,
    FilterExpression: 'email = :val',
    ExpressionAttributeValues: {
      ':val': email,
    },
  };

  // Call DynamoDB to scan through *all* items in the table
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

// Sends an email invite to a user for registering/logging in
module.exports.invite_user = withSentry(async (event) => {
  const body = JSON.parse(event.body);

  const ddb = new AWS.DynamoDB.DocumentClient();

  // check for id in request
  if (!body.id) {
    return {
      statusCode: 500,
      body: 'add_event_to_user_list expects keys "id"',
    };
  }

  // Create parameters for activity item
  const activityId = UUID.v4();

  const activityParams = {
    TableName: process.env.ACTIVITY_TABLE,
    Item: {
      id: activityId,
      user_id: body.id,
      event: INVITE_USER_EVENT,
      timestamp: new Date().toString(),
    },
  };

  // Call DynamoDB to add activity item to the table
  await ddb.put(activityParams).promise();

  const result = await inviteUserHelper(body);
  return {
    statusCode: 200,
    body: JSON.stringify(result),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
  };
});

// Updates an existing schedule user in the database
module.exports.update_user = withSentry(async (user) => {
  const ddb = new AWS.DynamoDB.DocumentClient();

  const body = JSON.parse(user.body);

  if (!body.id) {
    return {
      statusCode: 500,
      body: 'update_user expects key "id"',
    };
  }

  const { id } = body;

  // Initialize UpdateExpression for ddb.update()
  let update = 'SET';

  // Initialize ExpressionAttributeNames for ddb.update()
  const exprAttrNames = {};

  // Initialize ExpressionAttributeValues for ddb,updateItem()
  const exprAttrValues = {};

  let counter = 0;

  // dynamically update post request body params to document
  Object.keys(body).forEach((k) => {
    if (k !== 'id') {
      const ref = `val${counter}`;
      const updateElement = ` #${k} =:${ref},`;
      update = update.concat(updateElement);
      exprAttrNames[`#${k}`] = k;
      exprAttrValues[`:${ref}`] = body[k];
      counter += 1;
    }
  });

  // Remove trailing comma from UpdateExpression
  update = update.slice(0, -1);

  const params = {
    TableName: process.env.USERS_TABLE,
    Key: {
      id: id.toString(),
    },
    UpdateExpression: update,
    ExpressionAttributeNames: exprAttrNames,
    ExpressionAttributeValues: exprAttrValues,
  };

  // Call DynamoDB to update the item to the table
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

// Adds a user to banned users table
module.exports.ban_user = withSentry(async (event) => {
  const body = JSON.parse(event.body);

  if (!body.id) {
    return {
      statusCode: 500,
      body: 'ban_user expects keys "id"',
    };
  }

  const ddb = new AWS.DynamoDB.DocumentClient();

  const params = {
    TableName: process.env.BANNED_USERS_TABLE,
    Item: {},
  };

  // Dynamically add post request body params to document
  Object.keys(body).forEach((k) => {
    params.Item[k] = body[k];
  });

  // Call DynamoDB to add the item to the table
  const result = await ddb.put(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(result.Item),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
  };
});

// Retrieves all users from banned users table
module.exports.get_banned_users = withSentry(async () => {
  const params = {
    TableName: process.env.BANNED_USERS_TABLE,
  };

  const ddb = new AWS.DynamoDB.DocumentClient();

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

const referralIdGenerator = async (length) => {
  const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });
  const referralId = UUID.v4().substring(0, length);

  const checkerParams = {
    ExpressionAttributeValues: {
      ':a': { S: `${process.env.REGISTRATION_INVITE_URL}?r=${referralId}` },
    },
    FilterExpression: 'invite_link = :a',
    TableName: process.env.REGISTRATION_REFERRAL_TABLE,
  };

  const checkerResult = await ddb.scan(checkerParams).promise();

  if (checkerResult.Count > 0) {
    return await referralIdGenerator(length);
  }

  return referralId;
};

// Sends a confirmation email to the user after
// they register with a unique referral code
module.exports.send_registration_email = withSentry(async (event) => {
  let email = '';
  let firstName = '';
  let referral = '';

  const body = JSON.parse(event.body);

  // if the body includes a referral link, include it
  if (body.form_response.hidden && body.form_response.hidden.referral) {
    referral = body.form_response.hidden.referral;
  }

  body.form_response.answers.forEach((answer) => {
    if (answer.email) {
      email = answer.email;
    } else if (answer.field && answer.field.ref === 'first_name') {
      firstName = answer.text;
    }
  });

  const referralId = await referralIdGenerator(5);

  const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });
  const SecretsManager = new AWS.SecretsManager({ region: 'us-east-1' });
  const SecretsManagerKey = await SecretsManager.getSecretValue(
    { SecretId: process.env.SENDGRID_SECRET_NAME },
  ).promise();
  const decodedSendgridKey = JSON.parse(SecretsManagerKey.SecretString).SENDGRID_API_KEY;

  const inviteLink = `${process.env.REGISTRATION_INVITE_URL}?r=${referralId}`;

  // Send the user an email, using our template
  sgMail.setApiKey(decodedSendgridKey);

  const msg = {
    from: { email: 'tech@gotechnica.org' },
    reply_to: {
      email: "eventops@gotechnica.org"
    },
    personalizations: [{
      to: [{
        email,
      }],
      dynamic_template_data: {
        user_name: firstName,
        invite_link: inviteLink,
      },
    }],
    template_id: process.env.REGISTRATION_TEMPLATE_ID,
  };

  // If not running integration suites, send email
  if (process.env.STAGE !== TESTING_STAGE) {
    await sgMail.send(msg);
  }

  const refItem = {
    id: { S: UUID.v4() },
    firstname: { S: firstName },
    email: { S: email },
    invite_link: { S: inviteLink },
    timestamp: { S: new Date().toString() },
    referral_origin: { S: referral },
    registration_data: { S: JSON.stringify(body.form_response) },
  };

  await ddb.putItem({
    TableName: process.env.REGISTRATION_REFERRAL_TABLE,
    Item: refItem,
  }).promise();

  const SecretsManagerSlackKey = await SecretsManager.getSecretValue(
    { SecretId: process.env.SLACK_WEBHOOK_SECRET_NAME },
  ).promise();
  const webhookJSON = JSON.parse(SecretsManagerSlackKey.SecretString);
  const webhookUrl = webhookJSON.PLATFORM_ACTVITY_SLACK_WEBHOOK;
  const webhook = new IncomingWebhook(webhookUrl);
  if (process.env.STAGE !== TESTING_STAGE) {
    await webhook.send({
      text: `Successfully sent registration email confirmation to ${email}.`,
    });
  }

  return {
    statusCode: 200,
    body: JSON.stringify(refItem),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
  };
});

//Update an existing hacker's hacker profile
module.exports.update_hacker_profile = withSentry(async event =>{
  const ddb = new AWS.DynamoDB.DocumentClient();
  const body = JSON.parse(event.body);
  if (!body["user_id"] || !body["hacker_profile"]) {
    return {
      statusCode: 500,
      body: "Missing user_id or hacker_profile keys"
    };
  }

  //id to locate which hacker to update
  id = body["user_id"];
  var params = {
    TableName: process.env.USERS_TABLE,
    Key:{
      id: id.toString(),
    },
    UpdateExpression: "set hacker_profile = :p",
    ExpressionAttributeValues:{
        ":p": body.hacker_profile,
    },
    ReturnValues:"UPDATED_NEW"
  };

  //Call DynamoDB to update profile
  const result = await ddb.update(params).promise();
  
  return {
    statusCode: 200,
    body: JSON.stringify(result.Item),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    }
  };
});

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

  await ddb.put(params).promise();

  const SecretsManager = new AWS.SecretsManager({ region: 'us-east-1' });    
  const SecretsManagerSlackKey = await SecretsManager.getSecretValue(
    { SecretId: process.env.SLACK_WEBHOOK_SECRET_NAME },
  ).promise();
  const webhookJSON = JSON.parse(SecretsManagerSlackKey.SecretString);
  const webhookUrl = webhookJSON.PLATFORM_ACTVITY_SLACK_WEBHOOK;
  const webhook = new IncomingWebhook(webhookUrl);
  if (process.env.STAGE !== TESTING_STAGE) {
    if (body.action == 'TEAM_CREATION') {
      await webhook.send({
        text: `${body.user_name} performed ${body.action} on ${process.env.STAGE}`,
      });
    } else {
      await webhook.send({
        text: `${body.user_name} visited page ${body.action} on ${process.env.STAGE}`,
      });
    }
  }
    
  return {
    statusCode: 200,
    body: JSON.stringify(params.Item),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
  };
});
