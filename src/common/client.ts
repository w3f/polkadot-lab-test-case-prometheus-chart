import { Logger, createLogger } from '@w3f/logger';
import WebSocket from 'ws';

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
        this.ws.on('message', this.onMessage.bind(this));
        this.ws.on('close', this.onClose.bind(this));

        setTimeout(() => this.requestStatus, 5000);
    }

    onOpen(): void {
        this.logger.debug(`Connected to ${this.endpoint}`);

        const startMsg: Message = {
            action: Action.Start
        }
        this.ws.send(startMsg);
    }

    onMessage(data: any): void {
        this.logger.debug(`Received ${JSON.stringify(data)}`);
    }

    onClose(): void {
        this.logger.debug(`Closed connection to ${this.endpoint}`);
    }

    requestStatus(): void {
        const statusMsg: Message = {
            action: Action.Status
        }

        this.ws.send(statusMsg);
    }
}
