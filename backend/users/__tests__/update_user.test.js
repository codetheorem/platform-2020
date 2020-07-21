'use strict';

// tests for update_user
// Generated by serverless-jest-plugin

const mod = require('./../handler');

const jestPlugin = require('serverless-jest-plugin');
const lambdaWrapper = jestPlugin.lambdaWrapper;
const adder = lambdaWrapper.wrap(mod, { handler: 'add_user' });
const updater = lambdaWrapper.wrap(mod, { handler: 'update_user' });

const AWS = require('aws-sdk');

const insert_user = {
    body: JSON.stringify({
        email: "update@gmail.com",
        full_name: "Luo Owen",
        access_level: "Hack",
        group: "hacker"
    })
};

const update = {
    school: "University of Maryland, College Park",
    age: "18",
    devpost: "devpost.com/hugoburbelo",
    full_name: "Owen Luo"
};

const final = {
    email: { S: "update@gmail.com" },
    full_name: { S: "Owen Luo" },
    access_level: { S: "Hack" },
    group: { S: "hacker" },
    school: { S: "University of Maryland, College Park" },
    age: { S: "18" },
    devpost: { S: "devpost.com/hugoburbelo" }
};

const no_id = {
    body: JSON.stringify({
        email: "sample@gmail.com",
        full_name: "OwenLuo",
        access_level: "Hack",
        group: "hacker"
    })
};

describe('update_user', () => {
    beforeAll((done) => {
        done();
    });

    it('Correctly adds a user, update it, and check if it matches expected user', async () => {

        return await adder.run(insert_user).then(async (response) => {
            expect(response).toBeDefined();
            expect(response).toHaveProperty('statusCode', 200);
            const id = JSON.parse(response.body).id.S;
            update["id"] = id;
            final["id"] = { S: id };

            const update_user = {
                body: JSON.stringify(update)
            }

            return await updater.run(update_user).then(async (res) => {
                expect(res).toBeDefined();

                expect(res).toHaveProperty('statusCode', 200);
                const getRequest = {
                    TableName: process.env.USERS_TABLE,
                    Key: { id: { S: id } },
                };
                const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });
                const result = await ddb.getItem(getRequest).promise();
                expect(result.Item).toMatchObject(final);
            })
        });
    });

    it('Correctly rejects a response without an id', () => {

        return updater.run(no_id).then(async (response) => {
            expect(response).toBeDefined();
            expect(response).toHaveProperty('statusCode', 500);
        });
    });
});
