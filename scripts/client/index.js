const { Client } = require('../../dist/common');

const client = new Client('ws://localhost:3000');

function delay(delay) {
  return new Promise(function(resolve) {
    setTimeout(resolve, delay);
  });
}

async function main() {
  client.start();

  await delay(5000);

  const result = await client.requestStatus();
}

main();
