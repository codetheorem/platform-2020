const AWS = require('aws-sdk');
const withSentry = require('serverless-sentry-lib');
const UUID = require('uuid');

const TOTAL_EASTER_EGGS = 6;

AWS.config.update({ region: 'us-east-1' });

module.exports.get_easter_eggs = withSentry(async (event) => {
  if (!event.queryStringParameters || !event.queryStringParameters.user_id) {
    return {
      statusCode: 500,
      body: 'get_user_shortlink_clicks expects key "user_id"',
    };
  }

  const userId = event.queryStringParameters.user_id;
  const ddb = new AWS.DynamoDB.DocumentClient();

  const params = {
    TableName: process.env.EASTER_EGGS_TABLE,
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

// Adds a new shortlink click event to the database
module.exports.add_easter_eggs_for_user = withSentry(async (event) => {
  const body = JSON.parse(event.body);

  const ddb = new AWS.DynamoDB.DocumentClient();

  const scanParams = {
    TableName: process.env.EASTER_EGGS_TABLE,
    FilterExpression: 'user_id = :val',
    ExpressionAttributeValues: {
      ':val': body.user_id,
    },
  };

  const result = await ddb.scan(scanParams).promise();

  // If user already has easter eggs, do not proceed with creation
  if (result.Items.length > 0) {
    return {
      statusCode: 200,
      body: JSON.stringify({ result }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
    };
  }

  let count = 1;
  while (count <= TOTAL_EASTER_EGGS) {
    const id = UUID.v4();
    const params = {
      TableName: process.env.EASTER_EGGS_TABLE,
      Item: {
        id,
        user_id: body.user_id,
        easter_egg_id: count,
        discovered: false,
      },
    };
    // eslint-disable-next-line no-await-in-loop
    await ddb.put(params).promise();
    count += 1;
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ count }),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
  };
});

module.exports.discover_easter_egg = withSentry(async (event) => {
  const ddb = new AWS.DynamoDB.DocumentClient();
  const body = JSON.parse(event.body);
  if (!body.user_id || !body.id) {
    return {
      statusCode: 500,
      body: 'Missing user_id or id keys',
    };
  }

  const params = {
    TableName: process.env.EASTER_EGGS_TABLE,
    Key: {
      id: body.id,
    },
    UpdateExpression: 'set discovered = :p',
    ExpressionAttributeValues: {
      ':p': true,
    },
    ReturnValues: 'UPDATED_NEW',
  };

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

module.exports.add_sponsor_booth = withSentry(async (event) => {
  const body = JSON.parse(event.body);

  const ddb = new AWS.DynamoDB.DocumentClient();

  const id = UUID.v4();

  const params = {
    TableName: process.env.SPONSOR_BOOTHS_TABLE,
    Item: {},
  };

  body.id = id;

  Object.keys(body).forEach((k) => {
    params.Item[k] = body[k];
  });

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

module.exports.update_sponsor_booth = withSentry(async event => {
  const body = JSON.parse(event.body);
  const ddb = new AWS.DynamoDB.DocumentClient();

  if (!body["id"]) {
    return {
      statusCode: 500,
      body: "update_sponsor_booth expects key \"id\""
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
    TableName: process.env.SPONSOR_BOOTHS_TABLE,
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

module.exports.delete_sponsor_booth = withSentry(async (event) => {
  const body = JSON.parse(event.body);

  const ddb = new AWS.DynamoDB.DocumentClient();

  if (!body.id) {
    return {
      statusCode: 500,
      body: 'delete_sponsor expects key "id"',
    };
  }

  const params = {
    TableName: process.env.SPONSOR_BOOTHS_TABLE,
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

module.exports.get_sponsor_booths = withSentry(async () => {
  const params = {
    TableName: process.env.SPONSOR_BOOTHS_TABLE,
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

module.exports.get_sponsor_booth = withSentry(async (event) => {
  const id = event.queryStringParameters.id;
  const params = {
    TableName: process.env.SPONSOR_BOOTHS_TABLE,
    KeyConditionExpression: "#id = :id",
    ExpressionAttributeNames:{
      "#id": "id"
    },
    ExpressionAttributeValues: {
      ":id": id
    }
  };

  const ddb = new AWS.DynamoDB.DocumentClient();

  const result = await ddb.query(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(result),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
  };
});
