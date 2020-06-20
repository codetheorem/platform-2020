const AWS = require('aws-sdk');
const uuid = require('uuid');


module.exports.delete_user = async event => {
  const body = JSON.parse(event.body);
  const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

  // Call DynamoDB to delete the item
  const delete_params = {
    TableName: process.env.USERS_TABLE,
    Key: {
      'id': {S: body['id']},
    },
  };
  
  const status_result = await ddb.deleteItem(delete_params).promise();

  // return 500 on error
  return {
    statusCode: 200,
    body: JSON.stringify(status_result.Item),
  };
};