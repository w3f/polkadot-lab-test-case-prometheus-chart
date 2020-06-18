const { Client } = require('../../dist/common');
const { createLogger } = require('@w3f/logger');

const client = new Client('ws://localhost:3000');


async function main() {
  const logger = createLogger('debug');

  client.start();

  await client.delay(20000);

  const result = await client.requestStatus();

  logger.debug(`result: ${JSON.stringify(result)}`);
  process.exit(0);
}

main();
