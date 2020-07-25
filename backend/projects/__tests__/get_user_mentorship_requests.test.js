'use strict';

// tests for get_user_mentorship_requests
// Generated by serverless-jest-plugin

const mod = require('./../handler');

const jestPlugin = require('serverless-jest-plugin');
const lambdaWrapper = jestPlugin.lambdaWrapper;
const adder = lambdaWrapper.wrap(mod, { handler: 'create_mentorship_request' });
const wrapped = lambdaWrapper.wrap(mod, { handler: 'get_user_mentorship_requests' });
const AWS = require('aws-sdk');

let add_request = {
    body: JSON.stringify({
        title: "Ayuda me",
        description: "Que es programacion",
        category: "frontend",
        user_id: "its meee"
    })
};
describe('get_user_mentorship_requests', () => {
  beforeAll((done) => {
    done();
  });

  it('Correctly gets user mentorship request', async () => {
    const added = await adder.run(add_request);
    const addedId = JSON.parse(added.body).id;

    const request = {
        queryStringParameters: JSON.stringify({user_id: "its meee"})
    }
    return await wrapped.run(request).then(async (response) => {
        expect(response).toBeDefined();
        expect(response).toHaveProperty('statusCode', 200);

        //check if correct mentorship request is found
        const request = {
            TableName: process.env.MENTORSHIP_REQUESTS_TABLE,
            Key:{
                id: {S: addedId},
            }
        }

        const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
        const result = await ddb.getItem(request).promise();
        const descrip = {
            "S": "Que es programacion"
        }
        expect(result.Item.description).toMatchObject(descrip);
    });
  });

});
