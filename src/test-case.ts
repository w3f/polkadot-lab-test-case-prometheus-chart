import { Logger } from '@w3f/logger';
import {
    TestCase,
    LabResult,
    Status
} from '@w3f/polkadot-lab-types';


const name = 'number-of-peers';
const period = 1000;

export class NumberOfPeers implements TestCase {
    private currentResult: LabResult;

    constructor(private readonly logger: Logger) { }

    async start(): Promise<void> {
        const currentTime = Date.now().toString();
        this.currentResult = {
            name,
            startTime: currentTime,
            status: Status.InProgress,
            data: []
        };

        const that = this;
        setTimeout(async () => await that.getMetrics(), period);
    }

    async result(): Promise<LabResult> {
        const currentTime = Date.now().toString();

        this.currentResult.endTime = currentTime;

        return this.currentResult;
    }

    async getMetrics(): Promise<void> {
        this.logger.debug('getMetrics called');
    }
}
