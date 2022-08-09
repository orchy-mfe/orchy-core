import envVarablesSchema from './configurationPath'

describe('envVariables schema tests', () => {
  it('is valid config object', () => {
    envVarablesSchema.assert()
  });
});
