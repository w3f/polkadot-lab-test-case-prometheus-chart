import { Logger } from '@w3f/logger';
import {
    TestCase,
    LabResult
} from '@w3f/polkadot-lab-types';


export class NumberOfPeers implements TestCase {
    constructor(private readonly logger: Logger) { }

    async start(): Promise<void> { }

    async result(): Promise<LabResult> {
        return
    }
}
