export enum ResponseMessageType {
    CONNECTION,
    USER_TEXT,
    USER_CONNECTION,
    ERROR,
}

export enum UserMessageType {
    CONNECTION,
    TEXT,
}

export interface BaseMessage {
    type: ResponseMessageType;
    timestamp: number;
}

export interface ResponseMessage extends BaseMessage {
    success: boolean,
    message: string;
}