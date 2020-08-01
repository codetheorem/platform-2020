'use strict';

// tests for get_schedule
// Generated by serverless-jest-plugin

const mod = require('./../handler');

const jestPlugin = require('serverless-jest-plugin');
const lambdaWrapper = jestPlugin.lambdaWrapper;
const adder = lambdaWrapper.wrap(mod, { handler: 'add_event' });
const wrapped = lambdaWrapper.wrap(mod, { handler: 'get_schedule' });
const AWS = require('aws-sdk');

const params = {
  TableName: process.env.SCHEDULE_TABLE,
};

const sample_event = {
  category: "main",
  start_time: "2020-6-5T15:00:00Z",
  end_time: "2020-6-5T18:00:00Z",
  description: "A very cool workshop for Technica!",
  event_name: "hugo's awesome workshop",
  id: "1",
}

const insert_event = {
  body: JSON.stringify({
    id: "1",
    category: "main",
    description: "A very cool workshop for Technica!",
    start_time: "2020-6-5T15:00:00Z",
    end_time: "2020-6-5T18:00:00Z",
    event_name: "hugo's awesome workshop",
  })
}

describe('get_schedule', () => {
  beforeEach(async (done) => {
    done();
  });

  it('Correctly retrieves the schedule from the database', async () => {

    let response2 = await adder.run(insert_event);
      
    return wrapped.run().then((response) => {
      expect(response).toBeDefined();
      expect(response).toMatchObject({
        body: expect.any(String),
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        }
      })

      JSON.parse(response.body).forEach(schedule_event => {
        expect.assertions("category" in schedule_event);
        expect.assertions("start_time" in schedule_event);
        expect.assertions("end_time" in schedule_event);
      });
    });
  });
});
