// tests for send_registration_email
// Generated by serverless-jest-plugin

const jestPlugin = require('serverless-jest-plugin');
const mod = require('../handler');

const { lambdaWrapper } = jestPlugin;
const wrapped = lambdaWrapper.wrap(mod, { handler: 'send_registration_email' });

const user = {
  body: JSON.stringify({
    form_response: {
      hidden: {
        referral: 'xyzAB',
      },
      answers: [
        {
          type: 'text',
          text: 'Jane',
          field: {
            id: 'O74TVGnAP5cR',
            type: 'short_text',
            ref: 'first_name',
          },
        },
        {
          type: 'text',
          text: 'test',
          field: {
            id: 'Ph1KeCHPjqoR',
            type: 'short_text',
            ref: 'cba888f9-0ed1-4566-8e0e-de331b6f74d2',
          },
        },
        {
          type: 'email',
          email: 'tech@gotechnica.org',
          field: {
            id: 'LlqJK8vFEnem',
            type: 'email',
            ref: '33622ea7-a819-41b6-9e23-06d9f334804b',
          },
        },
      ],
    },
  }),
};

describe('send_registration_email', () => {
  beforeAll((done) => {
    done();
  });

  it('Valid user case', async () =>

    // Check to make sure our fancy event id was returned by endpoint
    await wrapped.run(user).then(async (response) => {
      expect(response).toBeDefined();
      expect(response).toMatchObject({
        body: expect.stringContaining('firstname":{"S":"Jane"},"email":{"S":"tech@gotechnica.org"'),
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
      });
    }));
});
