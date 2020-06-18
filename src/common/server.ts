import { Logger } from '@w3f/logger';
import { TestCase } from '@w3f/polkadot-lab-types';
import WebSocket from 'ws';
import { Server as WsServer } from 'ws';

import { Message, Action } from './types';


export class Server {
    private wss: WsServer;
    private ws: WebSocket;

    constructor(
        private readonly port: number,
        private readonly testCase: TestCase,
        private readonly logger: Logger
    ) { }

    async start(): Promise<void> {
        this.wss = new WebSocket.Server({ port: this.port });

        this.logger.info(`Websockets server listening in port ${this.port}`);

        this.wss.on('connection', this.onConnect.bind(this));
        this.wss.on('close', this.onClose.bind(this));
    }

    onConnect(ws: WebSocket): void {
        this.ws = ws;
        ws.on('message', this.onMessage.bind(this));
    }

    async onMessage(message: string): Promise<void> {
        this.logger.debug(`Received message on Websockets server: '${message}'`);

        const messageObj = JSON.parse(message) as Message;

        switch (messageObj.action) {
            case Action.Start: {
                await this.testCase.start();
                this.ws.send("");
                break;
            }
            case Action.Status || Action.Stop: {
                const result = await this.testCase.result();
                const resultStr = JSON.stringify(result);
                this.logger.debug(`sending result: '${resultStr}'`);
                this.ws.send(resultStr);
                break;
            }
            default:
                throw new Error(`Unknown action: ${messageObj.action}`);
        }
    }

    onClose(): void {
        delete this.ws;
        this.logger.debug('Closing Websockets server');
    }
}
