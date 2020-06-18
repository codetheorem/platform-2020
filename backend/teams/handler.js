const db = require("simple-dynamodb");
const AWS = require('aws-sdk');
const uuid = require('uuid');
// import { v4 as uuidv4 } from 'uuid';

const TABLE_NAME = 'platform-teams-dev';


module.exports.create_team = async event => {
  const body = JSON.parse(event.body);
  const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

  const params = {
    TableName: TABLE_NAME,
    Item: {
      'id': {S:uuid.v4()},
      // team_name: body["team_name"]
    },
  };

  // dynamically add post request body params to document
  Object.keys(body).forEach(k => {
    params.Item[k] = {S: body[k]}
  });

  // Call DynamoDB to add the item to the table
  const result = await ddb.putItem(params).promise()
  //   catch (e) {
  //     console.error(e);
  // }

  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };

  // catch error, return 500
};
