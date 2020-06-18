import { Logger, createLogger } from '@w3f/logger';
import WebSocket from 'ws';
import { LabResult } from '@w3f/polkadot-lab-types';

import { Message, Action } from './types';


export class Client {
    private ws: WebSocket;

    constructor(
        private readonly endpoint: string,
        private readonly logger?: Logger
    ) {
        if (!logger) {
            this.logger = createLogger('debug');
        }
    }

    start(): void {
        this.ws = new WebSocket(this.endpoint);

        this.ws.on('open', this.onOpen.bind(this));
        this.ws.on('close', this.onClose.bind(this));

        setTimeout(() => this.requestStatus, 5000);
    }

    requestStatus(): Promise<LabResult> {
        return new Promise((resolve) => {
            const statusMsg: Message = {
                action: Action.Status
            }

            this.ws.send(JSON.stringify(statusMsg));
            this.ws.on('message', (data) => {
                const obj = JSON.parse(data.toString());
                resolve(obj);
            });
        }
        );
    }

    delay(delay: number) {
        return new Promise(function(resolve) {
            setTimeout(resolve, delay);
        });
    }

    private onOpen(): void {
        this.logger.debug(`Connected to ${this.endpoint}`);

        const startMsg: Message = {
            action: Action.Start
        }
        this.ws.send(JSON.stringify(startMsg));
    }

    private onClose(): void {
        this.logger.debug(`Closed connection to ${this.endpoint}`);
    }
}
