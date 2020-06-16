'use strict';

// tests for add_event
// Generated by serverless-jest-plugin

const mod = require('./../handler');

const jestPlugin = require('serverless-jest-plugin');
const lambdaWrapper = jestPlugin.lambdaWrapper;
const wrapped = lambdaWrapper.wrap(mod, { handler: 'add_event' });

const AWS = require('aws-sdk-mock');

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

  it('Correctly inserts the event into the database', () => {
    const bodyStub = sample_event;
    AWS.mock('DynamoDB', 'putItem', function(params, callback) {
      callback(null, {Item: sample_event});
    });

    const event = {
      body: JSON.stringify(bodyStub)
    };
    return wrapped.run(event).then((response) => {
      expect(response).toBeDefined();
      expect(response).toMatchObject({body: JSON.stringify(sample_event), statusCode: 200})
    });
  });

});