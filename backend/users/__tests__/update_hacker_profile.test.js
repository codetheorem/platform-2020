'use strict';

// tests for update_user
// Generated by serverless-jest-plugin

const mod = require('./../handler');

const jestPlugin = require('serverless-jest-plugin');
const lambdaWrapper = jestPlugin.lambdaWrapper;
const adder = lambdaWrapper.wrap(mod, { handler: 'add_user' });
const updater = lambdaWrapper.wrap(mod, { handler: 'update_hacker_profile' });

const AWS = require('aws-sdk');

const insert_profile = {
    body: JSON.stringify({
        id: "temp",
        email: ":D@gmail.com",
        full_name: "Anna Feng",
        access_level: "Hack",
        group: "hacker",
        user_id: "1234",
        hacker_profile: {name: "Anna Feng", school: "UMDCP", year: "freshman", linkedin: "sdfjks", email: ":D@gmail.com"}
    })
};

const final = {
    id: "temp",
    email: ":D@gmail.com",
    full_name: "Anna Feng",
    access_level: "Hack",
    group: "hacker",
    user_id: "1234",
    hacker_profile: {year: "sophomore", email: ":D01@gmail.com"}
};

const no_hacker_profile = {
    body: JSON.stringify({
        "user_id": "1234",
        "hacker_inf0o": {year: "sophmore", email: ":D01@gmail.com"}
    })
};


describe('update_hacker_profile', () => {
    beforeAll((done) => {
        done();
    });

    it('Correctly adds a profile, update it, and check if it matches expected user', async () => {

        return await adder.run(insert_profile).then(async (response) => {
            expect(response).toBeDefined();
            expect(response).toHaveProperty('statusCode', 200);
            const id = JSON.parse(response.body).id;
            final.id = id;
            let update = {
                body: JSON.stringify({
                    user_id: id,
                    hacker_profile: {year: "sophomore", email: ":D01@gmail.com"}
                })
            }
            return await updater.run(update).then(async (res) => {
                expect(res).toBeDefined();
                expect(res).toHaveProperty('statusCode', 200);
                const getRequest = {
                    TableName: process.env.USERS_TABLE,
                    Key: {id} ,
                };
               
                const ddb = new AWS.DynamoDB.DocumentClient();
                const result = await ddb.get(getRequest).promise();
                expect(result.Item).toMatchObject(final);
            })
        });
    });

    it('Correctly rejects a response without an id', () => {
        return updater.run(no_hacker_profile).then(async (response) => {
            expect(response).toBeDefined();
            expect(response).toHaveProperty('statusCode', 500);
        });
    });
});
