// tests for add_user
// Generated by serverless-jest-plugin

const mod = require('../handler');

const jestPlugin = require('serverless-jest-plugin');

const { lambdaWrapper } = jestPlugin;
const adder = lambdaWrapper.wrap(mod, { handler: 'add_user' });

const AWS = require('aws-sdk');

const insert_user = {
  body: JSON.stringify({
    email: 'sample@gmail.com',
    full_name: 'OwenLuo',
    access_level: 'Hack',
    group: 'hacker',
  }),
};

const no_email = {
  body: JSON.stringify({
    full_name: 'where email',
    access_level: 'fail',
    group: 'hacker',
  }),
};

const no_full_name = {
  body: JSON.stringify({
    email: 'failure@gmail.com',
    access_level: 'fail',
    group: 'hacker',
  }),
};

const no_access_level = {
  body: JSON.stringify({
    email: 'failure@gmail.com',
    full_name: 'failure person',
    group: 'hacker',
  }),
};

const no_group = {
  body: JSON.stringify({
    email: 'sample@gmail.com',
    full_name: 'OopWheresMyGroup',
    access_level: 'hecker',
  }),
};

describe('add_user', () => {
  beforeAll((done) => {
    done();
  });

  it('Correctly adds a user and checks if exists', async () => await adder.run(insert_user).then(async (response) => {
    expect(response).toBeDefined();
    expect(response).toHaveProperty('statusCode', 200);
    const getRequest = {
      TableName: process.env.USERS_TABLE,
      Key: { id: JSON.parse(response.body).id },
    };
    const ddb = new AWS.DynamoDB.DocumentClient();
    const result = await ddb.get(getRequest).promise();
    expect(result.Item).toMatchObject(JSON.parse(response.body));
  }));

  it('Correctly rejects a response without an email', () => adder.run(no_email).then(async (response) => {
    expect(response).toBeDefined();
    expect(response).toHaveProperty('statusCode', 500);
  }));

  it('Correctly rejects a response without an full name', () => adder.run(no_full_name).then(async (response) => {
    expect(response).toBeDefined();
    expect(response).toHaveProperty('statusCode', 500);
  }));

  it('Correctly rejects a response without an access level', () => adder.run(no_access_level).then(async (response) => {
    expect(response).toBeDefined();
    expect(response).toHaveProperty('statusCode', 500);
  }));

  it('Correctly rejects a response without a group', () => adder.run(no_group).then(async (response) => {
    expect(response).toBeDefined();
    expect(response).toHaveProperty('statusCode', 500);
  }));
});
