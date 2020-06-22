const process = require('process');
const { should } = require('chai');

const { Client } = require('@w3f/polkadot-lab-test-case-common');
const { createLogger } = require('@w3f/logger');

const wsPort = process.env['WS_PORT'];
const client = new Client(`ws://localhost:${wsPort}`);
const nodes = process.env['NODES'];

const logger = createLogger('debug');

should();

describe('Prometheus TestCase', () => {
    it('should get results', async () => {
      client.start();

      await client.delay(40000);

      const result = await client.requestStatus();

      const dataLength = result.data.length;
      for (let i = 0; i< nodes; i++){
        const actual = parseInt(result.data[dataLength - i - 1].value[1]);
        actual.should.be.gt(0);
      }
    });
});
