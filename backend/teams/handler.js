const AWS = require('aws-sdk');
const UUID = require('uuid');
const withSentry = require('serverless-sentry-lib');

AWS.config.update({ region: 'us-east-1' });

const NO_EMAIL = 'noemail@gmail.com';

// Posts the request body fields to a DynamoDB table
const postRequestToTable = async (event, tableName) => {
  const body = JSON.parse(event.body);
  const ddb = new AWS.DynamoDB.DocumentClient();

  const params = {
    TableName: tableName,
    Item: {
      timestamp: new Date().toLocaleString(),
    },
  };

  const id = UUID.v4();
  body.id = id;

  // return 500 on team with no/missing params
  if (tableName === process.env.TEAMS_TABLE && !body.team_name) {
    return {
      statusCode: 500,
      body: 'Missing team_name',
    };
  }
  if (
    (tableName === process.env.INVITES_TABLE
      || tableName === process.env.MEMBERSHIPS_TABLE)
    && (!body.user_id && !body.team_id)
  ) {
    return {
      statusCode: 500,
      body: 'Missing required ids',
    };
  }
  if (Object.keys(body).length === 1) {
    return {
      statusCode: 500,
      body: 'No params',
    };
  }

  // dynamically add post request body params to document
  Object.keys(body).forEach((k) => {
    params.Item[k] = body[k];
  });

  // Call DynamoDB to add the item to the table
  await ddb.put(params).promise();

  // return 500 on error
  return {
    statusCode: 200,
    body: JSON.stringify(params.Item),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
  };
};

module.exports.create_team = withSentry(async (event) => postRequestToTable(event, process.env.TEAMS_TABLE));

module.exports.invite_to_team = withSentry(async (event) => {
  const returnEvent = event;
  const body = JSON.parse(returnEvent.body);
  const email = body.email || NO_EMAIL;
  const ddb = new AWS.DynamoDB.DocumentClient();

  const params = {
    TableName: process.env.USERS_TABLE,
    FilterExpression: 'email = :val',
    ExpressionAttributeValues: {
      ':val': email,
    },
  };

  const result = await ddb.scan(params).promise();
  if (result.Items && result.Items.length > 0) {
    const newBody = body;
    newBody.user_id = result.Items[0].id;
    returnEvent.body = JSON.stringify(newBody);
  }

  return postRequestToTable(returnEvent, process.env.INVITES_TABLE);
});

module.exports.join_team = withSentry(async (event) => postRequestToTable(event, process.env.MEMBERSHIPS_TABLE));

// find a membership item, delete it
module.exports.leave_team = withSentry(async (event) => {
  const body = JSON.parse(event.body);
  const ddb = new AWS.DynamoDB.DocumentClient();

  const params = {
    TableName: process.env.MEMBERSHIPS_TABLE,
    FilterExpression: 'user_id = :val',
    ExpressionAttributeValues: {
      ':val': body.user_id,
    },
  };

  const result = await ddb.scan(params).promise();

  // if no matches, return
  if (result.Count === 0) {
    return {
      statusCode: 500,
      body: 'Error, no membership found',
    };
  }

  const deleteParams = {
    TableName: process.env.MEMBERSHIPS_TABLE,
    Key: {
      id: result.Items[0].id,
    },
  };

  try {
    // Call DynamoDB to delete the item from the table
    const statusResult = await ddb.delete(deleteParams).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(statusResult),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: 'Error, id may not be present',
    };
  }
});

// Retrieves the team invites for a hacker
module.exports.get_team_invites = withSentry(async (event) => {
  const userId = event.queryStringParameters.user_id;

  if (!userId) {
    return {
      statusCode: 500,
      body: 'get_team_invites expects keys "user_id"',
    };
  }

  const ddb = new AWS.DynamoDB.DocumentClient();

  const params = {
    TableName: process.env.INVITES_TABLE,
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

module.exports.get_users_for_team = withSentry(async (event) => {
  const teamId = event.queryStringParameters.team_id;

  if (!teamId) {
    return {
      statusCode: 500,
      body: 'get_users_for_team expects keys "team_id"',
    };
  }

  const ddb = new AWS.DynamoDB.DocumentClient();

  const params = {
    TableName: process.env.MEMBERSHIPS_TABLE,
    FilterExpression: 'team_id = :val',
    ExpressionAttributeValues: {
      ':val': teamId,
    },
  };

  const membershipsResult = await ddb.scan(params).promise();

  const userIds = membershipsResult.Items.map((membership) => ({
    id: membership.user_id,
  }));

  const uniqueIds = [];
  userIds.forEach((userId) => {
    if (!uniqueIds.map((item) => item.id).includes(userId.id)) {
      uniqueIds.push(userId);
    }
  });

  const queryParams = { RequestItems: {} };
  queryParams.RequestItems[process.env.USERS_TABLE] = {
    Keys: uniqueIds,
    ProjectionExpression: 'id, full_name, email, school',
  };

  const usersResult = await ddb.batchGet(queryParams).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(usersResult.Responses[process.env.USERS_TABLE]),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
  };
});

module.exports.get_team_membership_for_user = withSentry(async (event) => {
  const userID = event.queryStringParameters.user_id;

  if (!userID) {
    return {
      statusCode: 500,
      body: 'get_team_invites expects keys "user_id"',
    };
  }

  const ddb = new AWS.DynamoDB.DocumentClient();

  const params = {
    TableName: process.env.MEMBERSHIPS_TABLE,
    FilterExpression: 'user_id = :val',
    ExpressionAttributeValues: {
      ':val': userID,
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

// Retrieves all the invites for a team
module.exports.get_hackers_invited_to_team = withSentry(async (event) => {
  const teamId = String(event.queryStringParameters.team_id);

  if (!teamId) {
    return {
      statusCode: 500,
      body: 'get_hackers_invited_to_team expects keys "team_id"',
    };
  }

  const ddb = new AWS.DynamoDB.DocumentClient();

  const params = {
    TableName: process.env.INVITES_TABLE,
    FilterExpression: 'team_id = :val',
    ExpressionAttributeValues: {
      ':val': teamId,
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
