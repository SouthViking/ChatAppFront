export enum MessageType {
    CONNECTION,
    TEXT,
    ERROR,
    NOTIFICATION,
}

export interface BaseMessage {
    type: MessageType;
    timestamp: number;
}

export interface TextMessage extends BaseMessage {
    type: MessageType.TEXT;
    username: string;
    text: string;
    sentAt: number;
}

export interface ConnectionMessage extends BaseMessage {
    type: MessageType.CONNECTION;
    username: string;
}

export interface ResponseMessage extends BaseMessage {
    success: boolean,
    message: string;
}