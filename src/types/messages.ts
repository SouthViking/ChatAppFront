import { ServerUserData } from './user';

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
    message?: string;
}

export interface ConnectionResponseMessage extends ResponseMessage {
    userData: ServerUserData;
    userList: ServerUserData[];
}