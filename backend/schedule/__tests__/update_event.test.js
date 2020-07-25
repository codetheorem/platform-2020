'use strict';

// tests for update_event

const mod = require('./../handler');

const jestPlugin = require('serverless-jest-plugin');
const lambdaWrapper = jestPlugin.lambdaWrapper;
const adder = lambdaWrapper.wrap(mod, { handler: 'add_event' });
const wrapped = lambdaWrapper.wrap(mod, { handler: 'update_event' });

const AWS = require('aws-sdk');

const old_event = {
    body: JSON.stringify({
        id: "hwat",
        category: "main",
        description: "Update this workshop for Technica!",
    })
}

const new_event = {
    body: JSON.stringify({
        id: "hwat",
        category: "main",
        description: "This workshop is updated for Technica!",
    })
}

const invalid_request = {
    body: JSON.stringify({
        category: "new category",
        description: "missing id :O",
    })
    
}


describe('update_event', () => {
  beforeAll((done) => {
    done();
  });

  it('Correctly adds and updates the event', async () => {
    const added = await adder.run(old_event);

    return await wrapped.run(new_event).then(async (response) => {
      expect(response).toBeDefined();
      expect(response).toMatchObject({body: {}, statusCode: 200});

      // Check to see if event updated
      const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
      const id = JSON.parse(new_event.body).id;
      
      const getChange = {
        TableName: process.env.SCHEDULE_TABLE,
        Key: {id: {S: id}},
      };

      const result = await ddb.getItem(getChange).promise();
      
      const descrip = {
          "S": "This workshop is updated for Technica!",
      }
      expect(result.Item.description).toMatchObject(descrip);
  
    });
  });

  it('Fails to update event without id', async () =>{
      const added = await adder.run(old_event);

      return await wrapped.run(invalid_request).then(async (response) => {
          expect(response).toBeDefined();
          expect(response).toMatchObject({body: {}, statusCode: 500});
      });
  });
});
