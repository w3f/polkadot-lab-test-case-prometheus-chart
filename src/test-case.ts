import { Logger } from '@w3f/logger';
import {
    TestCase,
    LabResult,
    Status,
    Value,
    DataItem
} from '@w3f/polkadot-lab-types';
import { PrometheusAPIClient, InstantResponse } from '@w3f/prometheus-api-client';


const name = 'number-of-peers';
const period = 1000;

export class NumberOfPeers implements TestCase {
    private currentResult: LabResult;
    private prometheusClient: PrometheusAPIClient;

    constructor(private readonly logger: Logger) {
        const cfg = {
            url: 'http://prometheus-operator-prometheus:9090',
            logger
        }
        this.prometheusClient = new PrometheusAPIClient(cfg);
    }

    async start(): Promise<void> {
        this.logger.debug('test-case starting');
        const currentTime = Date.now().toString();
        this.currentResult = {
            name,
            startTime: currentTime,
            status: Status.InProgress,
            data: []
        };

        setInterval(async () => await this.getMetrics(), period);
    }

    async result(): Promise<LabResult> {
        this.logger.debug('results requested');
        const currentTime = Date.now().toString();

        this.currentResult.endTime = currentTime;

        return this.currentResult;
    }

    private async getMetrics(): Promise<void> {
        this.logger.debug('getMetrics called');

        const queryInput = {
            query: 'polkadot_sub_libp2p_peers_count'
        };
        let result: InstantResponse;
        try {
            result = await this.prometheusClient.instantQuery(queryInput);
            this.logger.debug(`Result on test-case: ${JSON.stringify(result)}`);
        } catch (e) {
            this.currentResult.status = Status.Error;
            this.logger.error(`Could not fetch metrics: ${e}`);
        }
        const dataItem: DataItem = {
            values: []
        }
        result.data.result.forEach((item) => {
            dataItem.metric = item.metric;
            dataItem.values.push(["" + item.value[0] as String, item.value[1]] as Value);
        });
        this.currentResult.data.push(dataItem);
    }
}
