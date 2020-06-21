const { should } = require('chai');

const { Client } = require('@w3f/polkadot-lab-test-case-common');
const { createLogger } = require('@w3f/logger');

const client = new Client('ws://localhost:3000');
const logger = createLogger('debug');

should();

describe('Prometheus TestCase', () => {
    it('should get results', async () => {
      client.start();

      await client.delay(40000);

      const result = await client.requestStatus();

      logger.debug(`result: ${JSON.stringify(result)}`);
    });
});
