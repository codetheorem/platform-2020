const AWS = require('aws-sdk');
const UUID = require('uuid');
const withSentry = require("serverless-sentry-lib");

AWS.config.update({region:'us-east-1'});

// Posts the request body fields to a DynamoDB table
post_request_body_to_table = async (event, table_name) => {
  const body = JSON.parse(event.body);
  const ddb = new AWS.DynamoDB.DocumentClient();

  const params = {
    TableName: table_name,
    Item: {}
  };

  const id = UUID.v4();
  body.id = id;
  
  // return 500 on team with no/missing params
  if(table_name == process.env.TEAMS_TABLE && !body.team_name){
    return{
      statusCode: 500,
      body: "Missing team_name"
    };
  }
  else if((table_name == process.env.INVITES_TABLE || table_name == process.env.MEMBERSHIPS_TABLE) &&
          (!body.user_id || !body.team_id)){
    return{
      statusCode: 500,
      body: "Missing required ids"
    };
  }
  else if(Object.keys(body).length == 1){
    return{
      statusCode: 500,
      body: "No params"
    };
  }
  
  // dynamically add post request body params to document
  Object.keys(body).forEach(k => {
    params.Item[k] = body[k]
  });

  // Call DynamoDB to add the item to the table
  const result = await ddb.put(params).promise()

  // return 500 on error
  return {
    statusCode: 200,
    body: JSON.stringify(params.Item),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    }
  };
};

module.exports.create_team = withSentry(async event => {
  return post_request_body_to_table(event, process.env.TEAMS_TABLE);
});

module.exports.invite_to_team = withSentry(async event => {
  return post_request_body_to_table(event, process.env.INVITES_TABLE);
});

module.exports.join_team = withSentry(async event => {
  return post_request_body_to_table(event, process.env.MEMBERSHIPS_TABLE);
});

// find a membership item, delete it
module.exports.leave_team = withSentry(async event => {
  const body = JSON.parse(event.body);
  const ddb = new AWS.DynamoDB.DocumentClient();

  const params = {
    TableName: process.env.MEMBERSHIPS_TABLE,
    FilterExpression: "user_id = :val",
    ExpressionAttributeValues: {
      ":val" : body.user_id,
    }
  };

  const result = await ddb.scan(params).promise();
  
  //if no matches, return
  if (result.Count == 0) {
    return{
      statusCode: 500,
      body: "Error, no membership found"
    }
  }

  const delete_params = {
    TableName: process.env.MEMBERSHIPS_TABLE,
    Key: {
      'id': result.Items[0].id,
    },
  };
  
  try{
    // Call DynamoDB to delete the item from the table
    const status_result = await ddb.delete(delete_params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(status_result),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      }
    };
  }
  catch(error){
    return{
      statusCode: 500,
      body: "Error, id may not be present"
    }
  }
});

module.exports.get_team_invites = withSentry(async event => {
  const user_id = String(event.queryStringParameters.user_id);

  if (!user_id) {
    return {
      statusCode: 500,
      body: "get_team_invites expects keys \"user_id\""
    }
  }

  const ddb = new AWS.DynamoDB.DocumentClient();

  const params = {
    TableName: process.env.INVITES_TABLE,
    FilterExpression: "user_id = :val",
    ExpressionAttributeValues: {
      ":val" : user_id,
    }
  };

  const result = await ddb.scan(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(result.Items),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    }
  };
});

module.exports.get_users_for_team = withSentry(async event => {
  const team_id = String(event.queryStringParameters.team_id);

  if (!team_id) {
    return {
      statusCode: 500,
      body: "get_users_for_team expects keys \"team_id\""
    }
  }

  const ddb = new AWS.DynamoDB.DocumentClient();

  const params = {
    TableName: process.env.MEMBERSHIPS_TABLE,
    FilterExpression: "team_id = :val",
    ExpressionAttributeValues: {
      ":val" : team_id,
    }
  };

  const membershipsResult = await ddb.scan(params).promise();

  const userIds = membershipsResult.Items.map(membership => {return {id: membership.user_id}});

  let queryParams = {RequestItems: {}};
  queryParams.RequestItems[process.env.USERS_TABLE] = {
    Keys: userIds,
    ProjectionExpression: 'id, full_name, email, school'
  };

  const usersResult = await ddb.batchGet(queryParams).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(usersResult.Responses[process.env.USERS_TABLE]),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    }
  };
});

module.exports.get_team_membership_for_user = withSentry(async event => {
  const user_id = String(event.queryStringParameters.user_id);

  if (!user_id) {
    return {
      statusCode: 500,
      body: "get_team_invites expects keys \"user_id\""
    }
  }

  const ddb = new AWS.DynamoDB.DocumentClient();

  const params = {
    TableName: process.env.MEMBERSHIPS_TABLE,
    FilterExpression: "user_id = :val",
    ExpressionAttributeValues: {
      ":val" : user_id,
    }
  };

  const result = await ddb.scan(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(result.Items),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    }
  };
});