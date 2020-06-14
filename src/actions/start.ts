import { createLogger } from '@w3f/logger';
import { Config } from '@w3f/config';
import { TestCaseInputConfig } from '@w3f/polkadot-lab-types';

import { NumberOfPeers } from '../test-case';
import { Server } from '../common/server';


export async function startAction(cmd): Promise<void> {
    const cfg = new Config<TestCaseInputConfig>().parse(cmd.config);

    const logger = createLogger(cfg.logLevel);

    const testCase = new NumberOfPeers(logger);

    const server = new Server(
        cfg.port,
        testCase,
        logger
    );

    server.start();
}
