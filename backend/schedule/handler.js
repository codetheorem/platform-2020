const AWS = require('aws-sdk');
const UUID = require('uuid');
const withSentry = require('serverless-sentry-lib');
const rp = require('request-promise');

AWS.config.update({ region: 'us-east-1' });

const makeShortlink = async (length) => {
  const ddb = new AWS.DynamoDB.DocumentClient();

  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  const checkerParams = {
    ExpressionAttributeValues: {
      ':a': result,
    },
    FilterExpression: 'shortlink = :a',
    TableName: process.env.SHORTLINKS_TABLE,
  };

  const checkerResult = await ddb.scan(checkerParams).promise();

  // make another shortlink if it's not unique
  if (checkerResult.Count > 0) {
    result = makeShortlink(length);
  }

  return result;
};

const createShortlinkHelper = async (body) => {
  const ddb = new AWS.DynamoDB.DocumentClient();
  const id = UUID.v4();

  const shortlink = await makeShortlink(6);

  // add shortlink
  const params = {
    TableName: process.env.SHORTLINKS_TABLE,
    Item: {},
  };

  // dynamically add post request body params to document
  Object.keys(body).forEach((k) => {
    params.Item[k] = body[k];
  });

  params.Item.id = id;
  params.Item.shortlinks = shortlink;
  params.Item.full_link = `${process.env.PLATFORM_BASE_URL}/${shortlink}`;

  // Call DynamoDB to add the item to the table
  await ddb.put(params).promise();
  return params.Item;
};

const createMeetingHelper = async (eventName) => {

  // get all API keys
  const scanParams = {
    TableName: process.env.ZOOM_API_KEYS_TABLE,
  };
  const ddb = new AWS.DynamoDB.DocumentClient();
  const scanResult = await ddb.scan(scanParams).promise();

  let index = 0;
  let apiRequestSuccess = false;

  // cycle through API keys until we either make a successful request or we run out
  let result;
  const zoomLinkTable = process.env.ZOOM_LINK_TABLE;
  while (!apiRequestSuccess) {
    let zoomApiToken = scanResult.Items[index]['key'];
    let zoomApiEmail = scanResult.Items[index]['email'];

    // Make Zoom API call
    const options = {
      method: 'POST',
      uri: `https://api.zoom.us/v2/users/${zoomApiEmail}/meetings`,
      qs: {
        userId: zoomApiEmail,
      },
      auth: {
        // Provide your token here
        bearer: zoomApiToken,
      },
      headers: {
        'User-Agent': 'Zoom-Jwt-Request',
        'content-type': 'application/json',
      },

      body: {
        topic: 'Instant meeting',
        type: 1,
      },
      json: true, // Automatically parses the JSON string in the response
    };

    if (process.env.STAGE !== 'testing') {
      result = await rp.post(options);
      if (result.status > 201 && index+1 >= scanResult.Items.length) {
        return {
          statusCode: 500,
          body: 'Failed',
        };
      } else if (result.status > 201) {
        index += 1;
      } else {
        apiRequestSuccess = true;
      }
    } else {
      result = {
        join_url: 'https://zoom.us/12345_TEST',
      };
      apiRequestSuccess = true;
    }
  }

  const parsedResult = (result);

  const id = UUID.v4();

  const params = {
    TableName: zoomLinkTable,
    Item: {
      id,
      meeting_link: parsedResult.join_url,
      eventName,
    },
  };

  await ddb.put(params).promise();
  return parsedResult.join_url;
};

// Retrieves the entire list of schedule events from the database
module.exports.get_schedule = withSentry(async () => {
  const params = {
    TableName: process.env.SCHEDULE_TABLE,
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

// Retrieves a single schedule event from the database
module.exports.get_event = withSentry(async (event) => {
  const id = String(event.queryStringParameters.id);

  const ddb = new AWS.DynamoDB.DocumentClient();

  const item = await ddb.get({
    TableName: process.env.SCHEDULE_TABLE,
    Key: {
      id,
    },
  }).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(item),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
  };
});

// Adds a new schedule event to the database
module.exports.add_event = withSentry(async (event) => {
  const body = JSON.parse(event.body);

  const ddb = new AWS.DynamoDB.DocumentClient();

  const id = UUID.v4();

  const params = {
    TableName: process.env.SCHEDULE_TABLE,
    Item: {},
  };

  body.id = id;

  const zoomLink = await createMeetingHelper(body.event_name);
  const shortlink = await createShortlinkHelper({ link: zoomLink, target: body.event_name });

  body.link = shortlink.full_link;

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

// Updates an existing schedule event in the database
module.exports.update_event = withSentry(async (event) => {
  const ddb = new AWS.DynamoDB.DocumentClient();

  const body = JSON.parse(event.body);

  if (!body.id) {
    return {
      statusCode: 500,
      body: 'update_event expects key "id"',
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
    TableName: process.env.SCHEDULE_TABLE,
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

// Deletes an existing schedule event in the database
module.exports.delete_event_from_schedule = withSentry(async (event) => {
  const body = JSON.parse(event.body);

  const ddb = new AWS.DynamoDB.DocumentClient();

  if (!body.id) {
    return {
      statusCode: 500,
      body: 'delete_event_from_schedule expects key "id"',
    };
  }

  const params = {
    TableName: process.env.SCHEDULE_TABLE,
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

// Adds a new schedule event to the a user's list
module.exports.add_event_to_user_list = withSentry(async (event) => {
  const body = JSON.parse(event.body);

  if (!body.event_id || !body.user_id) {
    return {
      statusCode: 500,
      body: 'add_event_to_user_list expects keys "event_id" and "user_id"',
    };
  }

  const ddb = new AWS.DynamoDB.DocumentClient();

  const id = `${body.user_id}-${body.event_id}`;

  const params = {
    TableName: process.env.USER_EVENTS_TABLE,
    Item: {
      id,
      event_id: body.event_id,
      user_id: body.user_id,
    },
  };

  // Call DynamoDB to add the item to the table
  await ddb.put(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify({ id }),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
  };
});

// Deletes a schedule event from a user's list
module.exports.delete_event_from_user_list = withSentry(async (event) => {
  const body = JSON.parse(event.body);

  // Check for validity
  if (!body.id) {
    return {
      statusCode: 500,
      body: 'delete_event_from_user_list expects keys "id"',
    };
  }

  // Vars to be used later (db instance)
  const ddb = new AWS.DynamoDB.DocumentClient();

  const params = {
    TableName: process.env.USER_EVENTS_TABLE,
    Key: {
      id: body.id,
    },
  };

  // Call DynamoDB to delete the item from the table
  await ddb.delete(params).promise();

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
  };
});

// Creates and adds a new unique shortlink to the database, checking for duplicates
module.exports.add_shortlink = withSentry(async (event) => {
  const body = JSON.parse(event.body);

  if (!body.link || !body.target) {
    return {
      statusCode: 500,
      body: 'Missing link or target',
    };
  }

  const result = await createShortlinkHelper(body);

  return {
    statusCode: 200,
    body: JSON.stringify(result),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
  };
});

// Retrieves a single shortlink from the database
module.exports.get_shortlink = withSentry(async (event) => {
  const id = String(event.queryStringParameters.shortlinks);

  const ddb = new AWS.DynamoDB.DocumentClient();

  const item = await ddb.get({
    TableName: process.env.SHORTLINKS_TABLE,
    Key: {
      shortlinks: id,
    },
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

// Adds a new shortlink click event to the database
module.exports.add_shortlink_click = withSentry(async (event) => {
  const body = JSON.parse(event.body);

  const ddb = new AWS.DynamoDB.DocumentClient();

  const id = UUID.v4();

  const params = {
    TableName: process.env.SHORTLINK_CLICKS_TABLE,
    Item: {
      id,
      link_id: body.link_id,
      user_id: body.user_id,
      timestamp: new Date().toLocaleString(),
    },
  };

  // Call DynamoDB to add the item to the table
  await ddb.put(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify({ id }),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
  };
});

// Retrieves all schedule events added to the user's list
module.exports.get_events_from_user_list = withSentry(async (event) => {
  // Check for validity
  if (!event.queryStringParameters || !event.queryStringParameters.user_id) {
    return {
      statusCode: 500,
      body: 'get_events_from_user_list expects key "user_id"',
    };
  }

  // Vars to be used later (db instance)
  const userId = event.queryStringParameters.user_id;
  const ddb = new AWS.DynamoDB.DocumentClient();

  const params = {
    TableName: process.env.USER_EVENTS_TABLE,
    FilterExpression: 'user_id = :val',
    ExpressionAttributeValues: {
      ':val': userId,
    },
  };

  // Call DynamoDB to scan through *all* items in the table
  const result = await ddb.scan(params).promise();

  // Instead of just returning the ddb response, let's clean things up
  const response = {
    userId,
    event_ids: [],
  };

  result.Items.forEach((k) => {
    response.event_ids.push(k.event_id);
  });

  return {
    statusCode: 200,
    body: JSON.stringify(response),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
  };
});

module.exports.create_zoom_meeting = withSentry(async (event) => {
  const body = JSON.parse(event.body);
  // Check for validity
  if (!body.event_name) {
    return {
      statusCode: 500,
      body: 'create_zoom_meeting expects 1 parameter: event_name',
    };
  }

  const { eventName } = body;

  const zoomUrl = await createMeetingHelper(eventName);

  return {
    statusCode: 200,
    body: JSON.stringify({ zoom_link: zoomUrl }),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
  };
});

module.exports.get_user_shortlink_clicks = withSentry(async (event) => {
  if (!event.queryStringParameters || !event.queryStringParameters.user_id) {
    return {
      statusCode: 500,
      body: 'get_user_shortlink_clicks expects key "user_id"',
    };
  }

  const userId = event.queryStringParameters.user_id;
  const ddb = new AWS.DynamoDB.DocumentClient();

  const params = {
    TableName: process.env.SHORTLINK_CLICKS_TABLE,
    FilterExpression: 'user_id = :val',
    ExpressionAttributeValues: {
      ':val': userId,
    },
  };

  const result = await ddb.scan(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(result),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
  };
});
