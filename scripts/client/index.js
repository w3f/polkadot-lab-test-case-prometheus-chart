const { Client } = require('../../dist/common');

const client = new Client('ws://localhost:3000');

client.start();
