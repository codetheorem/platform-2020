const AWS = require('aws-sdk');
const UUID = require('uuid');
const withSentry = require('serverless-sentry-lib');
const { IncomingWebhook } = require('@slack/webhook');
const { WebClient } = require('@slack/web-api');
const axios = require('axios');

AWS.config.update({ region: 'us-east-1' });

// Retrieves all sponsors from the database
module.exports.get_sponsorship_info = withSentry(async () => {
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
      'Access-Control-Allow-Credentials': true,
    },
  };
});

// Adds a new sponsor to the database
module.exports.add_sponsor = withSentry(async (event) => {
  const body = JSON.parse(event.body);

  // use DocumentClient, which supports easily written db operations
  const ddb = new AWS.DynamoDB.DocumentClient();

  const id = UUID.v4();

  const params = {
    TableName: process.env.SPONSORS_INFO_TABLE,
    Item: {},
  };

  body.id = id;

  // dynamically add post request body params to document
  Object.keys(body).forEach((k) => {
    params.Item[k] = body[k];
  });

  // Call DynamoDB to add the item to the table
  await ddb.put(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(params.Item),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
  };
});

// Updates a sponsor in the database
module.exports.update_sponsor = withSentry(async event => {
  const body = JSON.parse(event.body);
  const ddb = new AWS.DynamoDB.DocumentClient();

  if (!body["id"]) {
    return {
      statusCode: 500,
      body: "update_sponsor expects key \"id\""
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

  // Remove trailing comma from UpdateExpression added on line 405
  update = update.slice(0, -1);

  const params = {
    TableName: process.env.SPONSORS_INFO_TABLE,
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

module.exports.delete_sponsor = withSentry(async (event) => {
  const body = JSON.parse(event.body);

  const ddb = new AWS.DynamoDB.DocumentClient();

  if (!body.id) {
    return {
      statusCode: 500,
      body: 'delete_sponsor expects key "id"',
    };
  }

  const params = {
    TableName: process.env.SPONSORS_INFO_TABLE,
    Key: {
      id: body.id,
    },
  };

  // Call DynamoDB to delete the item in the table
  await ddb.delete(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify({ id: body.id }),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
  };
});

// adds a new mentorship request to the database
module.exports.create_mentorship_request = withSentry(async (request) => {
  const body = JSON.parse(request.body);
  const ddb = new AWS.DynamoDB.DocumentClient();
  const id = UUID.v4();
  body.id = id;

  const userQueryParams = {
    TableName: process.env.USERS_TABLE,
    KeyConditionExpression: "#id = :id",
    ExpressionAttributeNames:{
      "#id": "id"
    },
    ExpressionAttributeValues: {
      ":id": body.user_id
    }
  };

  const userQueryResult = await ddb.query(userQueryParams).promise();
  const userName = userQueryResult.Items[0].full_name;

  // checks if any field is missing to create a request
  if (!body.title || !body.description || !body.topic) {
    return {
      statusCode: 500,
      body: 'create_mentorship_request is missing a field',
    };
  }

  const params = {
    TableName: process.env.MENTORSHIP_REQUESTS_TABLE,
    Item: {},
  };

  // dynamically add post request body params to document
  Object.keys(body).forEach((k) => {
    params.Item[k] = body[k];
  });

  params.Item.timestamp = new Date().toString();
  params.Item.full_user_name = userName;
  params.Item.resolved = false;

  // Call DynamoDB to add the item to the table
  await ddb.put(params).promise();

  const SecretsManager = new AWS.SecretsManager({ region: 'us-east-1' });    
  const SecretsManagerSlackKey = await SecretsManager.getSecretValue(
    { SecretId: process.env.SLACK_WEBHOOK_SECRET_NAME },
  ).promise();
  const webhookJSON = JSON.parse(SecretsManagerSlackKey.SecretString);
  const webhookUrl = webhookJSON.PLATFORM_ACTVITY_SLACK_WEBHOOK;
  const webhook = new IncomingWebhook(webhookUrl);

  await webhook.send({
    "blocks": [
      {
        "block_id": userName,
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "New mentorship request:"
        }
      },
      {
        "type": "section",
        "fields": [
          {
            "type": "mrkdwn",
            "text": "*Name:*\n" + userName
          },
          {
            "type": "mrkdwn",
            "text": "*Topic:*\n" + body.topic
          },
          {
            "type": "mrkdwn",
            "text": "*Title:*\n" + body.title,
          }
        ]
      },
      {
        "type": "section",
        "fields": [
          {
            "type": "mrkdwn",
            "text": "*Description:*\n" + body.description
          }
        ]
      },
      {
        "type": "actions",
        "elements": [
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "emoji": true,
              "text": "Claim"
            },
            "style": "primary",
            "value": body.id,
            "action_id": "U01C9B0C7KN"
          }
        ]
      }
    ]
  });

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

// Retrieves all active mentorship requests from the database
module.exports.get_active_mentorship_requests = withSentry(async () => {
  const params = {
    TableName: process.env.MENTORSHIP_REQUESTS_TABLE,
    KeyConditionExpression: 'active = true',
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

// update a mentorship request
module.exports.update_mentorship_request = withSentry(async (event) => {
  const body = JSON.parse(event.body);

  // dynamically add body params to update request
  // this assumes body params are flat, AKA no dicts/lists inside
  // use an attribute map to avoid a name conflict with reserved keywords
  // atm only supports 52 attribute mappings
  let updateExpression = 'set ';
  const attributeMap = {};
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let charIndex = 0;
  const charactersLength = characters.length;

  Object.keys(body).forEach((k) => {
    if (k !== 'id') {
      if (charIndex < charactersLength) {
        const attr = characters.charAt(charIndex);
        charIndex += 1;
        attributeMap[`:${attr}`] = body[k];
        updateExpression += `${k} = :${attr}, `;
      } else {
        throw new Error(
          'attribute placeholders exhausted (num of attributes is >52).',
        );
      }
    }
  });
  updateExpression = updateExpression.slice(0, -2);

  const params = {
    TableName: process.env.MENTORSHIP_REQUESTS_TABLE,
    Key: {
      id: body.id,
    },
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: attributeMap,
    ReturnValues: 'UPDATED_NEW', // return updated attributes
  };

  const ddb = new AWS.DynamoDB.DocumentClient();

  const result = await ddb.update(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(result.Items),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
  };
});

// Retrieves mentorship requests by a user from the database
module.exports.get_user_mentorship_requests = withSentry(async (event) => {
  const userId = event.queryStringParameters.user_id;

  const params = {
    TableName: process.env.MENTORSHIP_REQUESTS_TABLE,
    FilterExpression: 'user_id = :u',
    ExpressionAttributeValues: {
      ':u': userId,
    },
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

// Implement backend endpoint to create a new devpost submission for a team
module.exports.create_project_submission = withSentry(async (event) => {
  const body = JSON.parse(event.body);
  const devpostLinkTable = process.env.DEVPOST_LINK_TABLE;

  // Check for validity
  if (!body.team_id || !body.team_name || !body.devpost_link) {
    return {
      statusCode: 500,
      body: 'create_project_submission expects params: team_id, team_name, devpost_link',
    };
  }

  const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });
  const id = UUID.v4();

  const params = {
    TableName: devpostLinkTable,
    Item: {
      id: { S: id },
      team_id: { S: body.team_id },
      team_name: { S: body.team_name },
      devpost_link: { S: body.devpost_link },
    },
  };

  // Call DynamoDB to add the item to the table
  await ddb.putItem(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(params.Item),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
  };
});

// adds a new project submission checklist item to the database
module.exports.create_project_checklist_item = withSentry(async (request) => {
  const body = JSON.parse(request.body);
  const ddb = new AWS.DynamoDB.DocumentClient();

  // checks if any field is missing to create a request
  if (!body.team_id || !body.checklist_item_id) {
    return {
      statusCode: 500,
      body: 'create_project_checklist_item is missing a field',
    };
  }

  body.id = UUID.v4();
  body.is_checked = false;

  const params = {
    TableName: process.env.PROJECT_SUBMISSION_CHECKLIST_ITEMS_TABLE,
    Item: {},
  };

  // dynamically add post request body params to document
  Object.keys(body).forEach((k) => {
    params.Item[k] = body[k];
  });

  // Call DynamoDB to add the item to the table
  await ddb.put(params).promise();

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

// gets a project submission checklist from the database matching a team id
module.exports.get_project_checklist_item = withSentry(async (event) => {
  const teamId = event.queryStringParameters.team_id;

  const params = {
    TableName: process.env.PROJECT_SUBMISSION_CHECKLIST_ITEMS_TABLE,
    FilterExpression: 'team_id = :t',
    ExpressionAttributeValues: {
      ':t': teamId,
    },
  };

  // using DocumentClient auto parses the output into nice JSON!
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

// updates an existing project submission checklist item in the database
module.exports.update_project_checklist_item = withSentry(async (event) => {
  const ddb = new AWS.DynamoDB.DocumentClient();

  const body = JSON.parse(event.body);

  if (!body.id) {
    return {
      statusCode: 500,
      body: 'update_project_checklist_item expects key "id"',
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
    TableName: process.env.PROJECT_SUBMISSION_CHECKLIST_ITEMS_TABLE,
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
    body: JSON.stringify(result),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
  };
});

// Implement backend endpoint to update a devpost submission for a team
module.exports.update_project_submission = withSentry(async event => {
  const body = JSON.parse(event.body);
  const devpost_link_table = process.env.DEVPOST_LINK_TABLE;
  const ddb = new AWS.DynamoDB.DocumentClient();

  if (!body["id"]) {
    return {
      statusCode: 500,
      body: "update_project_submission expects key \"id\""
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

  // Remove trailing comma from UpdateExpression added on line 405
  update = update.slice(0, -1);

  const params = {
    TableName: devpost_link_table,
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

module.exports.claim_mentorship_request = withSentry(async (event) => {
  const ddb = new AWS.DynamoDB.DocumentClient();
  const body = event.body;
  const parsedPayload = JSON.parse(decodeURIComponent(body.slice(body.indexOf("payload=") + "payload=".length)));
  const user = parsedPayload.user;
  const mentor_slack_user_id = user.id;

  const SecretsManager = new AWS.SecretsManager({ region: 'us-east-1' });    
  const SecretsManagerSlackKey = await SecretsManager.getSecretValue(
    { SecretId: process.env.SLACK_WEBHOOK_SECRET_NAME },
  ).promise();
  const webhookJSON = JSON.parse(SecretsManagerSlackKey.SecretString);
  const webhookUrl = webhookJSON.PLATFORM_ACTVITY_SLACK_WEBHOOK;
  const webhook = new IncomingWebhook(webhookUrl);
  const SlackOauthToken = webhookJSON.PLATFORM_SLACK_OAUTH_TOKEN;

  const mentorship_request_id = parsedPayload.actions[0].value;
  const hacker_slack_user_id = parsedPayload.actions[0].action_id;
  const response_url = parsedPayload.response_url;

  const queryParams = {
    TableName: process.env.MENTORSHIP_REQUESTS_TABLE,
    KeyConditionExpression: "#id = :id",
    ExpressionAttributeNames:{
      "#id": "id"
    },
    ExpressionAttributeValues: {
      ":id": mentorship_request_id
    }
  };

  const queryResult = await ddb.query(queryParams).promise();
  const title = queryResult.Items[0].title;
  const user_name = queryResult.Items[0].full_user_name;

  const web = new WebClient(SlackOauthToken);
  const conversation = await web.conversations.open({ token: SlackOauthToken, users: mentor_slack_user_id + ',' + hacker_slack_user_id});
  const sendMessage = await web.chat.postMessage({ channel: conversation.channel.id, text: `Hi there! I'm connecting the two of you so <@${hacker_slack_user_id}> can recieve help with his mentorship request, titled: ${title}` });

  const slackUpdateMessageResponse = {
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "New mentorship request:"
        }
      },
      {
        "type": "section",
        "block_id": body.title,
        "fields": [
          {
            "type": "mrkdwn",
            "text": "*Name:*\n" + user_name
          },
          {
            "type": "mrkdwn",
            "text": "*Topic:*\n" + queryResult.Items[0].topic
          },
          {
            "type": "mrkdwn",
            "text": "*Title:*\n" + queryResult.Items[0].title,
          }
        ]
      },
      {
        "type": "section",
        "fields": [
          {
            "type": "mrkdwn",
            "text": "*Description:*\n" + queryResult.Items[0].description
          }
        ]
      },
      {
        "type": "section",
        "fields": [
          {
            "type": "mrkdwn",
            "text": `:white_check_mark: Claimed by <@${mentor_slack_user_id}>`
          }
        ]
      }
    ]
  };

  const updateResponse = await axios.post(response_url, slackUpdateMessageResponse);

  const updateParams = {
    TableName: process.env.MENTORSHIP_REQUESTS_TABLE,
    Key: {
      id: mentorship_request_id,
    },
    UpdateExpression: 'set resolved = :p',
    ExpressionAttributeValues: {
      ':p': true,
    },
    ReturnValues: 'UPDATED_NEW',
  };

  await ddb.update(updateParams).promise();

  return {
    statusCode: 200,
    body: JSON.stringify({}),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
  };
});