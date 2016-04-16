import common = require('./pubnub.common');
import helper = require('./helpers/jsonHelper');
export class PubNub extends common.PubNub {
    pubKey: string;
    subKey: string;
    pubnub: PubNub;

    constructor(pubKey: string, subKey: string, secretKey: string, cipherKey: string, enableSSL: boolean, iv: string);
    constructor(pubKey: string, subKey: string, secretKey: string, cipherKey: string, enableSSL: boolean);
    constructor(pubKey: string, subKey: string, secretKey: string, enableSSL: boolean);
    constructor(pubKey: string, subKey: string, secretKey: string);
    constructor(pubKey: string, subKey: string, enableSSL: boolean);
    constructor(pubKey: string, subKey: string)
    constructor(pubKey, subKey, secretKey?, cipherKey?, enableSSL?, iv?) {
        super();
        this.pubKey = pubKey;
        this.subKey = subKey;
        switch (arguments.length) {
            case 2:
                this.pubnub = new com.pubnub.api.Pubnub(pubKey, subKey);
                break;
            case 3:
                if (typeof arguments[2] === 'boolean') {
                    this.pubnub = new com.pubnub.api.Pubnub(pubKey, subKey, enableSSL);
                } else if (typeof arguments[2] === 'string') {
                    this.pubnub = new com.pubnub.api.Pubnub(pubKey, subKey, secretKey);
                }
                break;
            case 4:
                this.pubnub = new com.pubnub.api.Pubnub(pubKey, subKey, secretKey, enableSSL);
                break;
            case 5:
                this.pubnub = new com.pubnub.api.Pubnub(pubKey, subKey, secretKey, cipherKey, enableSSL);
                break;
            case 6:
                this.pubnub = new com.pubnub.api.Pubnub(pubKey, subKey, secretKey, cipherKey, enableSSL, iv);
                break;
        }



    }



    subscribe(channels, callback, timetoken: number);
    subscribe(channels, callback, timetoken: string);
    subscribe(channels: string, callback, timetoken: string);
    subscribe(channels: string, callback, timetoken: number);
    subscribe(channels, callback)
    subscribe(channels: string, callback)
    subscribe(channels, callback?, timetoken?) {
        let args = arguments;
        let _cb = com.pubnub.api.Callback.extend({
            connectCallback: function (channel, message) {
                callback.apply(null, [{ type: 'connect', channel: channel, message: helper.deserialize(message) }])
            },
            reconnectCallback: function (channel, message) {

                callback.apply(null, [{ type: 'reconnect', channel: channel, message: helper.deserialize(message) }])
            },
            successCallback: function (channel, message) {
                callback.apply(null, [{ type: 'success', channel: channel, message: helper.deserialize(message) }])
            },
            errorCallback: function (channel, message) {
                callback.apply(null, [{ type: 'error', channel: channel, message: helper.deserialize(message) }])
            }
        });

        return new Promise((resolve, reject) => {
            try {
                switch (args.length) {
                    case 2:
                        if (typeof channels === 'string') {
                            this.pubnub.subscribe(String(channels), new _cb());
                        } else if (Array.isArray(channels)) {
                            this.pubnub.subscribe(channels, new _cb());
                        }
                        break;
                    case 3:
                        if (typeof args[2] === 'number') {
                            this.pubnub.subscribe(String(channels), new _cb(), Number(timetoken));
                        } else if (typeof args[2] === 'string') {
                            this.pubnub.subscribe(String(channels), new _cb(), String(timetoken));
                        } else if (Array.isArray(args[0]) && typeof args[2] === 'string') {
                            this.pubnub.subscribe(channels, new _cb(), String(timetoken));
                        } else if (Array.isArray(args[0]) && typeof args[2] === 'number') {
                            this.pubnub.subscribe(channels, new _cb(), Number(timetoken));
                        }
                        break;

                }
                resolve();
            } catch (ex) {
                reject(ex)
            }

        })

    };

    publish(channel: string, message: any, storeInHistory: boolean, metadata, callback);
    publish(channel: string, message: any, storeInHistory: boolean, callback);
    publish(channel: string, message: any, metadata, callback);
    publish(channel: string, message: any, callback)
    publish(channel: string, message: any, storeInHistory?: boolean, metadata?, callback?: () => void) {
        //callback is undefined .... not sure why
        //using arguments[arguments.length -1] for now
        let args = arguments;
        let cb = arguments[arguments.length - 1];
        let _cb = com.pubnub.api.Callback.extend({
            successCallback: function (channel, message) {
                cb.apply(null, [{ type: 'success', channel: channel, message: helper.deserialize(message) }])
            },
            errorCallback: function (channel, message) {
                cb.apply(null, [{ type: 'error', channel: channel, message: helper.deserialize(message) }])
            }
        });

        return new Promise((resolve, reject) => {
            try {
                switch (args.length) {
                    case 3:
                        this.pubnub.publish(channel, helper.serialize(message), new _cb());
                        break;
                    case 4:
                        if (typeof args[2] === 'object') {
                            this.pubnub.publish(channel, helper.serialize(message), helper.serialize(metadata), new _cb());
                        } else if (typeof args[2] === 'boolean') {
                            this.pubnub.publish(channel, helper.serialize(message), storeInHistory, new _cb());
                        }
                        break;
                    case 5:
                        this.pubnub.publish(channel, helper.serialize(message), storeInHistory, helper.serialize(metadata), new _cb());
                        break;
                }
                resolve();
            } catch (ex) {
                reject(ex)
            }

        })
    };

    time(callback) {
        let _cb = com.pubnub.api.Callback.extend({
            successCallback: function (channel, message) {
                callback.apply(null, [{ type: 'success', channel: channel, message: helper.deserialize(message) }])
            },
            errorCallback: function (channel, message) {
                callback.apply(null, [{ type: 'error', channel: channel, message: helper.deserialize(message) }])
            }
        });

        return new Promise((resolve, reject) => {
            try {
                this.pubnub.time(new _cb());
                resolve();
            } catch (ex) {
                reject(ex)
            }

        })
    };

    unsubscribe(channels);
    unsubscribe(channels: string) {
        return new Promise((resolve, reject) => {
            try {
                if (Array.isArray(channels)) {
                    this.pubnub.unsubscribe(channels);
                } else if (typeof channels === 'string') {
                    this.pubnub.unsubscribe(channels);
                }
                resolve();
            }
            catch (ex) {
                reject(ex)
            }
        })
    };

    globalHereNow(callback) {
        let _cb = com.pubnub.api.Callback.extend({
            successCallback: function (channel, message) {
                callback.apply(null, [{ type: 'success', channel: channel, message: helper.deserialize(message) }])
            },
            errorCallback: function (channel, message) {
                callback.apply(null, [{ type: 'error', channel: channel, message: helper.deserialize(message) }])
            }
        });
        return new Promise((resolve, reject) => {
            try {
                this.pubnub.hereNow(val, true, new _cb());
                resolve();
            } catch (ex) {
                reject(ex)
            }

        })
    };

    hereNow(channel: string, state, disable_uuids, callback);
    hereNow(state: string, disable_uuids: boolean, callback);
    hereNow(channel: string, callback)
    hereNow(channel?: string, state?, disable_uuids?, callback?) {
        let args = arguments;
        let _cb = com.pubnub.api.Callback.extend({
            successCallback: function (channel, message) {
                callback.apply(null, [{ type: 'success', channel: channel, message: helper.deserialize(message) }])
            },
            errorCallback: function (channel, message) {
                callback.apply(null, [{ type: 'error', channel: channel, message: helper.deserialize(message) }])
            }
        });

        return new Promise((resolve, reject) => {
            try {
                switch (args.length) {
                    case 2:
                        this.pubnub.hereNow(channel, new _cb());
                        break;
                    case 3:

                        this.pubnub.hereNow(state, disable_uuids, new _cb());
                        break;
                    case 4:
                        this.pubnub.hereNow(channel, state, disable_uuids, new _cb());
                        break;
                }

                resolve();
            } catch (ex) {
                reject(ex)
            }

        })
    };

    whereNow(channel: string, callback: () => void) {
        let _cb = com.pubnub.api.Callback.extend({
            successCallback: function (channel, message) {
                callback.apply(null, [{ type: 'success', channel: channel, message: helper.deserialize(message) }])
            },
            errorCallback: function (channel, message) {
                callback.apply(null, [{ type: 'error', channel: channel, message: helper.deserialize(message) }])
            }
        });

        return new Promise((resolve, reject) => {
            try {
                this.pubnub.whereNow(channel, new _cb());
                resolve();
            } catch (ex) {
                reject(ex)
            }

        })
    };

    presence(channel: string, callback: () => void) {
        let _cb = com.pubnub.api.Callback.extend({
            connectCallback: function (channel, message) {
                callback.apply(null, [{ type: 'connect', channel: channel, message: helper.deserialize(message) }])
            },
            disconnectCallback: function (channel, message) {
                callback.apply(null, [{ type: 'disconnect', channel: channel, message: helper.deserialize(message) }])
            },
            reconnectCallback: function (channel, message) {

                callback.apply(null, [{ type: 'reconnect', channel: channel, message: helper.deserialize(message) }])
            },
            successCallback: function (channel, message) {
                callback.apply(null, [{ type: 'success', channel: channel, message: helper.deserialize(message) }])
            },
            errorCallback: function (channel, message) {
                callback.apply(null, [{ type: 'error', channel: channel, message: helper.deserialize(message) }])
            }
        });

        return new Promise((resolve, reject) => {
            try {
                this.pubnub.presence(channel, new _cb());
                resolve();
            } catch (ex) {
                reject(ex)
            }

        })
    };

    uuid() {
        return this.pubnub.uuid();
    };

    getUUID() {
        return this.pubnub.getUUID();
    };

    setUUID(uuid: string) {
        this.pubnub.setUUID(uuid);
    };

    getAuthKey() {
        return this.pubnub.getAuthKey();
    };

    getFilter() {
        return this.pubnub.getFilter();
    };

    getState(channel: string, uuid: string, callback: () => void) {
        let _cb = com.pubnub.api.Callback.extend({
            successCallback: function (channel, message) {
                callback.apply(null, [{ type: 'success', channel: channel, message: helper.deserialize(message) }])
            },
            errorCallback: function (channel, message) {
                callback.apply(null, [{ type: 'error', channel: channel, message: helper.deserialize(message) }])
            }
        });

        return new Promise((resolve, reject) => {
            try {
                this.pubnub.getState(channel, uuid, new _cb());
                resolve();
            } catch (ex) {
                reject(ex)
            }

        })
    };

    setState(channel: string, uuid: string, state, callback: () => void) {
        if (typeof state === 'object' && Boolean(state)) {
            let _cb = com.pubnub.api.Callback.extend({
                successCallback: function (channel, message) {
                    callback.apply(null, [{ type: 'success', channel: channel, message: helper.deserialize(message) }])
                },
                errorCallback: function (channel, message) {
                    callback.apply(null, [{ type: 'error', channel: channel, message: helper.deserialize(message) }])
                }
            });

            return new Promise((resolve, reject) => {
                try {
                    this.pubnub.setState(channel, uuid, helper.serialize(state), new _cb());
                    resolve();
                } catch (ex) {
                    reject(ex)
                }

            })
        }

    }










    history(channel, count, callback): void;
    history(channel, reverse, callback): void;
    history(channel, start, end, callback): void;
    history(channel, count, reverse, callback): void;
    history(channel, start, reverse, callback): void;
    history(channel, start, count, callback): void;
    history(channel, includeTimetoken, count, callback): void;
    history(channel, start, count, reverse, callback): void;
    history(channel, start, end, count, callback): void;
    history(channel, start, end, count, reverse, includeTimetoken, callback): void;
    history(channel: string, start?: number, end?: number, count?: number, reverse?: boolean, includeTimetoken?: boolean, callback?) {

        let args = arguments;
        callback = args[args.length - 1];
        let _cb = com.pubnub.api.Callback.extend({
            successCallback: function (channel, message) {
                callback.apply(null, [{ type: 'success', channel: channel, message: helper.deserialize(message) }])
            },
            errorCallback: function (channel, message) {
                callback.apply(null, [{ type: 'error', channel: channel, message: helper.deserialize(message) }])
            }
        });
        return new Promise((resolve, reject) => {
            try {
                switch (args.length) {
                    case 3:
                        if (typeof args[1] === 'number') {
                            count = args[1];
                            this.pubnub.history(channel, args[1], new _cb());
                        } else if (typeof args[1] === 'boolean') {
                            reverse = args[1];
                            this.pubnub.history(channel, reverse, new _cb());
                        }
                        break;
                    case 4:
                        if ((typeof args[1] === 'number' && args[1] > 100) && (typeof args[2] === 'number' && args[2] > 100)) {
                            start = args[1];
                            end = args[2];

                            this.pubnub.history(channel, start, end, new _cb());
                        } else if ((typeof args[1] === 'number' && args[1] > 100) && (typeof args[2] === 'number' && args[2] <= 100)) {

                            start = args[1];
                            count = args[2];

                            this.pubnub.history(channel, start, count, new _cb());
                        } else if ((typeof args[1] === 'number' && args[1] > 100) && typeof args[2] === 'boolean') {

                            start = args[1];
                            reverse = args[2];

                            this.pubnub.history(channel, start, reverse, new _cb());
                        } else if ((typeof args[1] === 'number' && args[1] <= 100) && typeof args[2] === 'boolean') {

                            count = args[1];
                            reverse = args[2];

                            this.pubnub.history(channel, count, reverse, new _cb());
                        } else if (typeof args[1] === 'boolean') {

                            includeTimetoken = args[1];
                            count = args[2];

                            this.pubnub.history(channel, includeTimetoken, count, new _cb());
                        }

                        break;
                    case 5:
                        if ((typeof args[2] === 'number' && args[1] <= 100) && typeof args[2] === 'boolean') {

                            start = args[1];
                            count = args[2];
                            reverse = args[2];

                            this.pubnub.history(channel, start, count, reverse, new _cb());
                        } else if ((typeof args[2] === 'number' && args[1] > 100) && (typeof args[1] === 'number' && args[2] <= 100)) {

                            start = args[1];
                            end = args[2];
                            count = args[2];

                            this.pubnub.history(channel, start, end, count, new _cb());
                        }
                        break;
                    case 7:
                        this.pubnub.history(channel, start, end, count, reverse, includeTimetoken, new _cb());
                        break;
                }

                resolve();
            } catch (ex) {
                reject(ex)
            }

        })
    };

    setHeartbeat(beat) {
        this.pubnub.setHeartbeat(beat);
    };
    setHeartbeatInterval(beatInt) {
        this.pubnub.setHeartbeatInterval(beatInt);
    };
    setResumeOnReconnect(value) {
        this.pubnub.setResumeOnReconnect(value);
    };
    channelGroupAddChannel(group: string, channels, callback)
    channelGroupAddChannel(group: string, channels, callback) {
        let args = arguments;
        let _cb = com.pubnub.api.Callback.extend({
            successCallback: function (channel, message) {
                callback.apply(null, [{ type: 'success', channel: channel, message: helper.deserialize(message) }])
            },
            errorCallback: function (channel, message) {
                callback.apply(null, [{ type: 'error', channel: channel, message: helper.deserialize(message) }])
            }
        });

        return new Promise((resolve, reject) => {
            try {
                switch (args.length) {
                    case 3:
                        if (typeof args[1] === 'string') {
                            this.pubnub.channelGroupAddChannel(group, channels, new _cb());
                        } else if (Array.isArray(channels)) {
                            this.pubnub.channelGroupAddChannel(group, channels, new _cb());
                        }
                        break;
                }

                resolve();
            } catch (ex) {
                reject(ex)
            }

        })
    };

    pamGrant(channel: string, auth_key: string, read: boolean, write: boolean, int: number, callback)
    pamGrant(channel: string, auth_key: string, read: boolean, write: boolean, callback)
    pamGrant(channel: string, read: boolean, write: boolean, int: number, callback)
    pamGrant(channel: string, read: boolean, write: boolean, callback)
    pamGrant(channel, auth_key?, read?, write?, int?, callback?) {
        let args = arguments;
        let _cb = com.pubnub.api.Callback.extend({
            successCallback: function (channel, message) {
                callback.apply(null, [{ type: 'success', channel: channel, message: helper.deserialize(message) }])
            },
            errorCallback: function (channel, message) {
                callback.apply(null, [{ type: 'error', channel: channel, message: helper.deserialize(message) }])
            }
        });
        return new Promise((resolve, reject) => {
            try {

                switch (args.length) {
                    case 4:
                        this.pubnub.pamGrant(channel, read, write, new _cb());
                        break;
                    case 5:
                        if (typeof args[1] === 'string' && typeof args[1] === 'boolean') {
                            this.pubnub.pamGrant(channel, auth_key, read, write, new _cb());
                        } else if (typeof args[1] === 'boolean' && typeof args[3] === 'number') {
                            this.pubnub.pamGrant(channel, read, write, int, new _cb());
                        }
                        break;
                    case 6:
                        this.pubnub.pamGrant(channel, auth_key, read, write, int, new _cb());
                        break;
                }
                resolve();
            } catch (ex) {
                reject(ex);
            }
        })

    }
}