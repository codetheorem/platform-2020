'use strict';

// tests for get_event
// Generated by serverless-jest-plugin

const mod = require('./../handler');

const jestPlugin = require('serverless-jest-plugin');
const lambdaWrapper = jestPlugin.lambdaWrapper;
const wrapped = lambdaWrapper.wrap(mod, { handler: 'get_event' });

const sample_event = {
  category: { S: "main"},
  start_time: { S: "2020-6-5T15:00:00Z"},
  end_time: { S: "2020-6-5T18:00:00Z"},
  description: { S: "A very cool workshop for Technica!"},
  id: { S: "1"},
}


describe('get_event', () => {
  beforeAll((done) => {
    done();
  });

  const event = {
    queryStringParameters: {id: 1}
  };

  it('Correctly retrieves the event from the database', () => {

    return wrapped.run(event).then((response) => {
      expect(response).toBeDefined();
      expect(response).toMatchObject({body: JSON.stringify(sample_event), statusCode: 200})
    });
  });
});
