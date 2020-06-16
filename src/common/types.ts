import { LabResult } from '@w3f/polkadot-lab-types';


export enum Action {
    Start = 'start',
    Stop = 'stop',
    Status = 'status,'
}

export interface Message {
    action: Action;
}

export type Response = LabResult;
