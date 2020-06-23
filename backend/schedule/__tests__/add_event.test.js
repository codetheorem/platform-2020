'use strict';

// tests for add_event
// Generated by serverless-jest-plugin

const mod = require('./../handler');

const jestPlugin = require('serverless-jest-plugin');
const lambdaWrapper = jestPlugin.lambdaWrapper;
const wrapped = lambdaWrapper.wrap(mod, { handler: 'add_event' });

const AWS = require('aws-sdk');

const sample_event = {
  id: "1",
  category: "main",
  description: "A very cool workshop for Technica!",
  start_time: "2020-6-5T15:00:00Z",
  end_time: "2020-6-5T18:00:00Z",
}

describe('add_event', () => {
  beforeAll((done) => {
    done();
  });

  it('Correctly inserts the event into the database', async () => {
    const bodyStub = sample_event;
    const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

    const event = {
      body: JSON.stringify(bodyStub)
    };
    return await wrapped.run(event).then(async (response) => {
      expect(response).toBeDefined();
      expect(response).toMatchObject({body: JSON.stringify(sample_event), statusCode: 200})
    });
  });

});
