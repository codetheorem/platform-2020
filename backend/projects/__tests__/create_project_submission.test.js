// tests for create_project_submission
// Generated by serverless-jest-plugin

const jestPlugin = require('serverless-jest-plugin');
const mod = require('../handler');

const { lambdaWrapper } = jestPlugin;
const wrapped = lambdaWrapper.wrap(mod, { handler: 'create_project_submission' });

const example_request = {
  team_id: '1234',
  team_name: 'my awesome team',
  devpost_link: 'devpost.com/test',
};

const example_failed_request_no_event = {
  wrong_param: 'no',
};

const example_failed_request_empty_event = {

};

const example_failed_request_too_many_event = {
  team_id: '1234',
  team_name: 'my awesome team',
  devpost_link: 'devpost.com/test',
  user_id: 'shouldnothave',
};

describe('create_project_submission', () => {
  beforeAll((done) => {
    done();
  });

  it('Correctly creates a project submission in the database', async () => {
    const bodyStub = example_request;

    const event = {
      body: JSON.stringify(bodyStub),
    };

    return await wrapped.run(event).then((response) => {
      const res = JSON.parse(response.body);

      expect(response).toBeDefined();
      expect(JSON.parse(response.body)).toHaveProperty('id');
      expect(JSON.parse(response.body)).toHaveProperty('team_id');
      expect(JSON.parse(response.body)).toHaveProperty('team_name');
      expect(JSON.parse(response.body)).toHaveProperty('devpost_link');
      expect(JSON.parse(response.body)).toMatchObject(res); // Matches the response from the server, with the original
    });
  });

  it('Creates a project submission with the wrong variables', () => {
    const bodyStub = example_failed_request_no_event;

    const event = {
      body: JSON.stringify(bodyStub),
    };
    return wrapped.run(event).then((response) => {
      expect(response).toBeDefined();
      expect(response).toHaveProperty('statusCode', 500);
    });
  });

  it('Creates a project submission with no variables at all', () => {
    const bodyStub = example_failed_request_empty_event;

    const event = {
      body: JSON.stringify(bodyStub),
    };
    return wrapped.run(event).then((response) => {
      expect(response).toBeDefined();
      expect(response).toHaveProperty('statusCode', 500);
    });
  });

  it('Creates a project submission with too many variables', async () => {
    const bodyStub = example_failed_request_too_many_event;

    const event = {
      body: JSON.stringify(bodyStub),
    };
    return await wrapped.run(event).then((response) => {
      const res = JSON.parse(response.body);

      expect(response).toBeDefined();
      // It shouldn't fail, it'll just have params passed in that aren't used
      expect(JSON.parse(response.body)).toHaveProperty('id');
      expect(JSON.parse(response.body)).toHaveProperty('team_id');
      expect(JSON.parse(response.body)).toHaveProperty('team_name');
      expect(JSON.parse(response.body)).toHaveProperty('devpost_link');
      expect(JSON.parse(response.body)).toMatchObject(res); // Matches the response from the server, with the original
    });
  });
});
