// tests for multiple endpoints
// Generated by serverless-jest-plugin

const jestPlugin = require('serverless-jest-plugin');
const mod = require('../handler');

const { lambdaWrapper } = jestPlugin;
const create = lambdaWrapper.wrap(mod, { handler: 'create_team'});
const adder = lambdaWrapper.wrap(mod, { handler: 'join_team' });
const getter = lambdaWrapper.wrap(mod, { handler: 'get_team_membership_for_user' });
const AWS = require('aws-sdk');

const valid_team = {
    body: JSON.stringify({
        team_name: "ABCD",
    })
};

const valid_invited_team = {
    body: JSON.stringify({
        "team_id": "ABCD",
        "user_id": "2j3kjfd9sfjdsk-23"
    })
};

const invalid_get_request = {
  queryStringParameters: {},
};

const get_request = {
  queryStringParameters: { user_id: '2j3kjfd9sfjdsk-23' },
};

describe('get_team_invites', () => {
  beforeAll((done) => {
    done();
  });
  
  it('Accepts request to get team for a certain user', async() =>{
    const team = await create.run(valid_team);
    const added = await adder.run(valid_invited_team);
    const addedId = JSON.parse(added.body).id;
    const addedTime = JSON.parse(added.body).timestamp
    const teamId = "ABCD";
    const userId = '2j3kjfd9sfjdsk-23';
    
    return await getter.run(get_request).then(async (response) =>{
        
        expect(response).toBeDefined();
        expect(response).toHaveProperty('statusCode', 200);

        const request = {
          TableName: process.env.MEMBERSHIPS_TABLE,
          Key: {
            id: addedId,
          },
        };
        
        const ddb = new AWS.DynamoDB.DocumentClient();
        const result = await ddb.get(request).promise();

        expect(result.Item.id).toMatch(addedId);
        expect(result.Item.user_id).toMatch(userId);
        expect(result.Item.team_id).toMatch(teamId);
        expect(result.Item.timestamp).toMatch(addedTime);
    }); 
  });
  
  it('Fails request to get team for a certain user', async() =>{
    
    return await getter.run(invalid_get_request).then(async (response) =>{
        expect(response).toBeDefined();
        expect(response).toHaveProperty('statusCode', 500);
    }); 
  });
});
