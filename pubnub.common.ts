export class TNSPubNub {
    dateToTimeToken(date) {
        return +new Date(date) * 10000000;
    }
}

export interface TNSPubNubConfiguration {
    subscribeKey: string;
    publishKey?: string;
    secretKey?: string;
    cipherKey?: string;
    uuid?: string;
    logVerbosity?: string;
    authKey?: string;
    cacheBusting?: boolean;
    secure?: boolean;
    connectTimeout?: number;
    subscribeTimeout?: number;
    nonSubscribeRequestTimeout?: number;
    filterExpression?: string;
    heartbeatNotificationOptions?: string;
    origin?: string;
    reconnectionPolicy?: string;
}