const AWS = require('aws-sdk');
const UUID = require('uuid');
const Axios = require('axios');
const withSentry = require("serverless-sentry-lib");
const rp = require("request-promise")

AWS.config.update({region:'us-east-1'});


// Retrieves the entire list of schedule events from the database
module.exports.get_schedule = withSentry(async event => {
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
      'Access-Control-Allow-Credentials': true
    }
  };
});

// Retrieves a single schedule event from the database
module.exports.get_event = withSentry(async event => {
  const id = String(event.queryStringParameters.id);

  const ddb = new AWS.DynamoDB.DocumentClient();

  const item = await ddb.get({
    TableName: process.env.SCHEDULE_TABLE,
    Key: {
      id: id
    }
  }).promise();
  
  return {
    statusCode: 200,
    body: JSON.stringify(item),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    }
  };
});

// Adds a new schedule event to the database
module.exports.add_event = withSentry(async event => {
  const body = JSON.parse(event.body);

  const ddb = new AWS.DynamoDB.DocumentClient();

  const id = UUID.v4();

  const params = {
    TableName: process.env.SCHEDULE_TABLE,
    Item: {}
  };

  body.id = id;

  const zoomLink = await create_meeting_helper(body.event_name);
  const shortlink = await create_shortlink_helper({link: zoomLink, target: body.event_name});

  body.link = shortlink.full_link;

  // dynamically add post request body params to document
  Object.keys(body).forEach(k => {
    params.Item[k] = body[k];
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

// Updates an existing schedule event in the database
module.exports.update_event = withSentry(async event => {

  const ddb = new AWS.DynamoDB.DocumentClient();
    
  const body = JSON.parse(event.body);

  if (!body["id"]) {
    return {
      statusCode: 500,
      body: "update_event expects key \"id\""
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
    TableName: process.env.SCHEDULE_TABLE,
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

// Deletes an existing schedule event in the database
module.exports.delete_event_from_schedule = withSentry(async event => {
  const body = JSON.parse(event.body);

  const ddb = new AWS.DynamoDB.DocumentClient();
    
  if (!body.id) {
    return {
      statusCode: 500,
      body: "delete_event_from_schedule expects key \"id\""
    }
  }

  const params = {
    TableName: process.env.SCHEDULE_TABLE,
    Key: {
      id: body.id,
    }
  };

  // Call DynamoDB to delete the item in the table
  const result = await ddb.delete(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify({id: body.id}),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    }
  };
});

// Adds a new schedule event to the a user's list
module.exports.add_event_to_user_list = withSentry(async event => {
  const body = JSON.parse(event.body);

  if (!body.event_id || !body.user_id) {
    return {
      statusCode: 500,
      body: "add_event_to_user_list expects keys \"event_id\" and \"user_id\""
    }
  }

  const ddb = new AWS.DynamoDB.DocumentClient();

  const id = body.user_id + "-" + body.event_id;

  const params = {
    TableName: process.env.USER_EVENTS_TABLE,
    Item: {
      id: id,
      event_id: body.event_id,
      user_id: body.user_id
    }
  };

  // Call DynamoDB to add the item to the table
  const result = await ddb.put(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify({id: id}),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    }
  };
});

// Deletes a schedule event from a user's list
module.exports.delete_event_from_user_list = withSentry(async event => {
  const body = JSON.parse(event.body);

  // Check for validity
  if (!body.id) {
    return {
      statusCode: 500,
      body: "delete_event_from_user_list expects keys \"id\""
    }
  }

  // Vars to be used later (db instance)
  const ddb = new AWS.DynamoDB.DocumentClient();

  const params = {
    TableName: process.env.USER_EVENTS_TABLE,
    Key: {
      id: body.id,
    }
  };

  // Call DynamoDB to delete the item from the table
  const result = await ddb.delete(params).promise();

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    }
  };
});


make_shortlink = (length) => {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for ( let i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const create_shortlink_helper = async (body) => {
  const ddb = new AWS.DynamoDB.DocumentClient();

  const id = UUID.v4();
  let shortlink;
  let checker_result;
  let checker_params;
  //check that shortlink is unique
  do {
    shortlink = make_shortlink(6);

    checker_params = {
      ExpressionAttributeValues: {
       ":a": shortlink
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
  body.shortlinks = shortlink;
  body.full_link = process.env.PLATFORM_BASE_URL + "/" + shortlink;

  // dynamically add post request body params to document
  Object.keys(body).forEach(k => {
    params.Item[k] = body[k]
  });

  // Call DynamoDB to add the item to the table
  const result = await ddb.put(params).promise();
  return params.Item;
}

// Creates and adds a new unique shortlink to the database, checking for duplicates
module.exports.add_shortlink = withSentry(async event => {
  const body = JSON.parse(event.body);

  if(!body.link || !body.target){
    return {
      statusCode: 500,
      body: "Missing link or target"
    }
  }

  const result = await create_shortlink_helper(body);

  return {
    statusCode: 200,
    body: JSON.stringify(result),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    }
  };
});

// Retrieves a single shortlink from the database
module.exports.get_shortlink = withSentry(async event => {
  const id = String(event.queryStringParameters.shortlinks);

  const ddb = new AWS.DynamoDB.DocumentClient();

  const item = await ddb.get({
    TableName: process.env.SHORTLINKS_TABLE,
    Key: {
      shortlinks: id
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

// Adds a new shortlink click event to the database 
module.exports.add_shortlink_click = withSentry(async event => {
  const body = JSON.parse(event.body);

  const ddb = new AWS.DynamoDB.DocumentClient();

  const id = UUID.v4();

  const params = {
    TableName: process.env.SHORTLINK_CLICKS_TABLE,
    Item: {
      id: id,
      link_id: body["link_id"],
      user_id: body["user_id"],
      timestamp: new Date().toLocaleString()
    }
  };
  
  // Call DynamoDB to add the item to the table
  const result = await ddb.put(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify({id: id}),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    }
  };
});

// Retrieves all schedule events added to the user's list
module.exports.get_events_from_user_list = withSentry(async event => {
  // Check for validity
  if (!event.queryStringParameters || !event.queryStringParameters.user_id) {
    return {
      statusCode: 500,
      body: "get_events_from_user_list expects key \"user_id\""
    }
  }

  // Vars to be used later (db instance)
  const user_id = event.queryStringParameters.user_id;
  const ddb = new AWS.DynamoDB.DocumentClient();

  const params = {
    TableName: process.env.USER_EVENTS_TABLE,
    FilterExpression: "user_id = :val",
    ExpressionAttributeValues: {
      ":val" : user_id,
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
    response.event_ids.push(k.event_id)
  });

  return {
    statusCode: 200,
    body: JSON.stringify(response),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    }
  };
});

const create_meeting_helper = async (event_name) => {
  const SecretsManager = new AWS.SecretsManager({ region: 'us-east-1' });
  const SecretsManagerKey = await SecretsManager.getSecretValue({SecretId: process.env.ZOOM_API_KEY_SECRET_NAME}).promise();
  const decodedZoomAPIKey = JSON.parse(SecretsManagerKey.SecretString).ZOOM_TESTING_API_KEY;

  //Make Zoom API call
  const zoom_api_email = process.env.ZOOM_API_EMAIL_ACCOUNT
  const zoom_api_token = decodedZoomAPIKey
  const zoom_link_table = process.env.ZOOM_LINK_TABLE
  
  var options = {
    method: 'POST',
    uri: `https://api.zoom.us/v2/users/${zoom_api_email}/meetings`,
    qs: {
        userId: zoom_api_email
    },
    auth: {
      //Provide your token here
        'bearer': zoom_api_token
    },
    headers: {
        'User-Agent': 'Zoom-Jwt-Request',
        'content-type': 'application/json'
    },
    
    body: {
        "topic": "Instant meeting",
        "type": 1
    },
    json: true // Automatically parses the JSON string in the response
  };

  let result;
  if(process.env.STAGE !== "testing") {
    result = await rp.post(options);
    if (result.status > 201) {
      return {
        statusCode: 500,
        body: "Failed"
      }
    }
  } else {
    result = {
      join_url: "https://zoom.us/12345_TEST"
    }
  }

  
  
  let parsed_result = (result)            


  const ddb = new AWS.DynamoDB.DocumentClient();
  const id = UUID.v4();

  const params = {
    TableName: zoom_link_table,
    Item: {
      id: id,
      meeting_link: parsed_result.join_url,
      event_name: event_name,
    }
  };
  
  const database_return = await ddb.put(params).promise();
  return parsed_result.join_url;
}

module.exports.create_zoom_meeting = withSentry(async event => {
  
  const body = JSON.parse(event.body);
  
  // Check for validity
  if (!body.event_name) {
    return {
      statusCode: 500,
      body: "create_zoom_meeting expects 1 parameter: event_name"
    }
  }
  
  const event_name = body.event_name;

  const zoom_url = await create_meeting_helper(event_name);

  return {
    statusCode: 200,
    body: JSON.stringify({zoom_link: zoom_url}),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    }
  };
});
