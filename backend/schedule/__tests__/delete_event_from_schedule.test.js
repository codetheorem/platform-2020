'use strict';

// tests for delete_event_from_schedule

const mod = require('./../handler');

const jestPlugin = require('serverless-jest-plugin');
const lambdaWrapper = jestPlugin.lambdaWrapper;
const adder = lambdaWrapper.wrap(mod, { handler: 'add_event' });
const wrapped = lambdaWrapper.wrap(mod, { handler: 'delete_event_from_schedule' });

const AWS = require('aws-sdk');

const delete_event = {
    body: JSON.stringify({
        id: "delete moi",
        category: "main",
        description: "Delete this workshop for Technica!",
    })
}

const valid_request = {
    body: JSON.stringify({
        id: "delete moi",
    })
}

const invalid_request = {
    body: JSON.stringify({
        category: "new category",
        description: "missing id :O",
    })
    
}


describe('delete_event_from_schedule', () => {
  beforeAll((done) => {
    done();
  });

  it('Correctly adds and deletes the event', async () => {
    const added = await adder.run(delete_event);

    return await wrapped.run(valid_request).then(async (response) => {
      expect(response).toBeDefined();
      expect(response).toMatchObject({body: {}, statusCode: 200});

      // Check to see if event deleted
      const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
      const id = JSON.parse(delete_event.body).id;
      
      const getChange = {
        TableName: process.env.SCHEDULE_TABLE,
        Key: {id: {S: id}},
      };

      const result = await ddb.getItem(getChange).promise();
      
      expect(result).toMatchObject({});
  
    });
  });

  it('Fails to delete event without id', async () =>{
      const added = await adder.run(delete_event);

      return await wrapped.run(invalid_request).then(async (response) => {
          expect(response).toBeDefined();
          expect(response).toMatchObject({body: {}, statusCode: 500});
      });
  });
});
