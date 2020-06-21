import { Logger } from '@w3f/logger';
import {
    TestCase,
    LabResult,
    Status,
    Value,
    DataItem,
    PrometheusConfig
} from '@w3f/polkadot-lab-types';
import { PrometheusAPIClient, InstantResponse } from '@w3f/prometheus-api-client';


export class Prometheus implements TestCase {
    private currentResult: LabResult;
    private prometheusClient: PrometheusAPIClient;

    constructor(
        private readonly config: PrometheusConfig,
        private readonly logger: Logger) {
        const clientCfg = {
            url: 'http://prometheus-operator-prometheus:9090',
            logger
        }
        this.prometheusClient = new PrometheusAPIClient(clientCfg);
    }

    async start(): Promise<void> {
        this.logger.debug('test-case starting');
        const currentTime = Date.now().toString();
        this.currentResult = {
            name: this.config.name,
            startTime: currentTime,
            status: Status.InProgress,
            data: []
        };

        setInterval(async () => await this.getMetrics(), this.config.period);
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
            query: this.config.query
        };
        let result: InstantResponse;
        try {
            result = await this.prometheusClient.instantQuery(queryInput);
            this.logger.debug(`Result on test-case: ${JSON.stringify(result)}`);
        } catch (e) {
            this.currentResult.status = Status.Error;
            this.logger.error(`Could not fetch metrics: ${e}`);
        }
        result.data.result.forEach((item) => {
            const dataItem: DataItem = {
                metric: item.metric,
                value: ["" + item.value[0] as string, item.value[1]] as Value
            };
            this.currentResult.data.push(dataItem);
        });
    }
}
