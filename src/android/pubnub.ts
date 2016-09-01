declare var com;
import common = require('../pubnub.common');
import helper = require('./helper');
const PNConfiguration = com.pubnub.api.PNConfiguration;
const PNLogVerbosity = com.pubnub.api.enums.PNLogVerbosity;
const PNHeartbeatNotificationOptions = com.pubnub.api.enums.PNHeartbeatNotificationOptions;
const PNReconnectionPolicy = com.pubnub.api.enums.PNReconnectionPolicy;
export class PubNub extends common.PubNub {
    private _pubnub;
    private _config;
    constructor(config: Config) {
        super();
        this._config = new PNConfiguration();
        if (config.subscribeKey) {
            this._config.setSubscribeKey(config.subscribeKey);
        } else {
            throw new Error('SubScribeKey cannot be empty')
        }
        if (config.publishKey) {
            this._config.setPublishKey(config.publishKey);
        }
        if (config.secretKey) {
            this._config.setSecretKey(config.secretKey);
        }
        if (config.cipher) {
            this._config.setCipherKey(config.cipher);
        }
        if (config.uuid) {
            this._config.setUuid(config.uuid);
        }
        if (config.verbosity) {
            switch (config.verbosity) {
                case 'body':
                    this._config.setLogVerbosity(PNLogVerbosity.BODY);
                    break;
                default:
                    this._config.setLogVerbosity(PNLogVerbosity.NONE);
                    break;

            }
        }
        if (config.authKey) {
            this._config.setAuthKey(config.authKey);
        }
        if (config.cacheBusting) {
            this._config.setCacheBusting(config.cacheBusting);
        }
        if (config.secure) {
            this._config.setSecure(config.secure);
        }
        if (config.connectTimeout) {
            this._config.setConnectTimeout(config.connectTimeout);
        }
        if (config.subscribeTimeout) {
            this._config.setSubscribeTimeout(config.subscribeTimeout);
        }
        if (config.nonSubscribeRequestTimeout) {
            this._config.setNonSubscribeRequestTimeout(config.nonSubscribeRequestTimeout);
        }
        if (config.filterExpression) {
            this._config.setFilterExpression(config.filterExpression);
        }
        if (config.heartbeatNotificationOptions) {
            switch (config.heartbeatNotificationOptions) {
                case 'all':
                    this._config.setHeartbeatNotificationOptions(PNHeartbeatNotificationOptions.ALL);
                    break;
                case 'none':
                    this._config.setHeartbeatNotificationOptions(PNHeartbeatNotificationOptions.NONE);
                    break;
                default:
                    this._config.setHeartbeatNotificationOptions(PNHeartbeatNotificationOptions.FAILURES);
                    break;
            }
        }
        if (config.origin) {
            this._config.setOrigin(config.origin);
        }
        if (config.reconnectionPolicy) {
            switch (config.reconnectionPolicy) {
                case 'linear':
                    this._config.setReconnectionPolicy(PNReconnectionPolicy.LINEAR);
                    break;
                case 'exponential':
                    this._config.setReconnectionPolicy(PNReconnectionPolicy.EXPONENTIAL);
                    break;
                default:
                    this._config.setReconnectionPolicy(PNReconnectionPolicy.NONE);
                    break;
            }
        }
        this._pubnub = new PubNub(this._config);
    };

    subscribe(...args: any[]): Promise<any> {
        let channels;
        let channel;
        let timetoken;
        return new Promise((resolve, reject) => {
            let _cb = com.pubnub.api.Callback.extend({
                connectCallback: function (channel, message) {
                    resolve({type: 'connect', channel: channel, message: helper.deserialize(message)});
                },
                disconnectCallback: function (channel, message) {
                    resolve({type: 'disconnect', channel: channel, message: helper.deserialize(message)})
                },
                reconnectCallback: function (channel, message) {
                    resolve({type: 'reconnect', channel: channel, message: helper.deserialize(message)})
                },
                successCallback: function (channel, message) {
                    resolve({type: 'success', channel: channel, message: helper.deserialize(message)})
                },
                errorCallback: function (channel, message) {
                    console.log(message.toString())
                    reject({type: 'error', channel: channel, message: helper.deserialize(message)})
                }
            });


            switch (args.length) {
                case 1:
                    if (typeof args[0] === 'string') {
                        channel = args[0];
                        this.pubnub.subscribe(channel, new _cb());
                    } else if (Array.isArray(args[0])) {
                        channels = Array.create(java.lang.String, args[0].length);
                        args[0].forEach((item, key) => {
                            channels[key] = item;
                        });
                        this.pubnub.subscribe(channels, new _cb());
                    }
                    break;
                case 2:
                    timetoken = args[1]
                    if (typeof args[1] === 'number') {
                        channel = args[0];
                        this.pubnub.subscribe(channel, new _cb(), timetoken);
                    } else if (typeof args[1] === 'string') {
                        channel = args[0];
                        this.pubnub.subscribe(channel, new _cb(), timetoken);
                    } else if (Array.isArray(args[0]) && typeof args[1] === 'string') {
                        channels = Array.create(java.lang.String, args[0].length);
                        args[0].forEach((item, key) => {
                            channels[key] = item;
                        });
                        this.pubnub.subscribe(channels, new _cb(), timetoken);
                    } else if (Array.isArray(args[0]) && typeof args[1] === 'number') {
                        channels = Array.create(java.lang.String, args[0].length);
                        args[0].forEach((item, key) => {
                            channels[key] = item;
                        });
                        this.pubnub.subscribe(channels, new _cb(), timetoken);
                    }
                    break;

            }
        })

    };

    publish(...args: any[]): Promise<any> {
        let channel = args[0];
        let message = helper.serialize(args[1]);
        return new Promise((resolve, reject) => {
            let _cb = com.pubnub.api.Callback.extend({
                successCallback: function (channel, message) {
                    resolve({type: 'success', channel: channel, message: helper.deserialize(message)});
                },
                errorCallback: function (channel, message) {
                    reject({type: 'error', channel: channel, message: helper.deserialize(message)});
                }
            });


            switch (args.length) {
                case 2:
                    this.pubnub.publish(channel, message, new _cb());
                    break;
                case 3:
                    if (typeof args[2] === 'object') {
                        let metadata = helper.serialize(args[2]);
                        this.pubnub.publish(channel, message, metadata, new _cb());
                    } else if (typeof args[2] === 'boolean') {
                        let storeInHistory = args[2];
                        this.pubnub.publish(channel, message, storeInHistory, new _cb());
                    }
                    break;
                case 4:
                    let metadata = helper.serialize(args[3]);
                    let storeInHistory = args[2];
                    this.pubnub.publish(channel, message, storeInHistory, metadata, new _cb());
                    break;
            }
        });


    };

    time(): Promise<any> {
        return new Promise((resolve, reject) => {
            let _cb = com.pubnub.api.Callback.extend({
                successCallback: function (channel, message) {
                    resolve({type: 'success', channel: channel, message: helper.deserialize(message)})
                },
                errorCallback: function (channel, message) {
                    resolve({type: 'error', channel: channel, message: helper.deserialize(message)})
                }
            });

            this.pubnub.time(new _cb());
        });

    };

    unsubscribe(...args: any[]) {
        let channel;
        let channels;

        if (Array.isArray(args[0])) {
            channels = Array.create(java.lang.String, args[0].length);
            args[0].forEach((item, key) => {
                channels[key] = item;
            });
            this.pubnub.unsubscribe(channels);
        } else if (typeof args[0] === 'string') {
            channel = args[0];
            this.pubnub.unsubscribe(channel);
        }

    };

    unsubscribeAll() {
        this.pubnub.unsubscribeAll();
    };

    globalHereNow(): Promise<any> {
        return new Promise((resolve, reject) => {
            let _cb = com.pubnub.api.Callback.extend({
                successCallback: function (channel, message) {
                    resolve({type: 'success', channel: channel, message: helper.deserialize(message)})
                },
                errorCallback: function (channel, message) {
                    reject({type: 'error', channel: channel, message: helper.deserialize(message)})
                }
            });
            this.pubnub.hereNow(true, true, new _cb());
        });

    };

    hereNow(...args: any[]): Promise<any> {
        let channel;
        let state;
        let disable_uuids;
        return new Promise((resolve, reject) => {
            let _cb = com.pubnub.api.Callback.extend({
                successCallback: function (channel, message) {
                    resolve({type: 'success', channel: channel, message: helper.deserialize(message)});
                },
                errorCallback: function (channel, message) {
                    reject({type: 'error', channel: channel, message: helper.deserialize(message)});
                }
            });


            switch (args.length) {
                case 1:
                    channel = args[0];
                    this.pubnub.hereNow(channel, new _cb());
                    break;
                case 2:
                    state = args[0];
                    disable_uuids = args[1];
                    this.pubnub.hereNow(state, disable_uuids, new _cb());
                    break;
                case 3:
                    channel = args[0];
                    state = args[1];
                    disable_uuids = args[2];
                    this.pubnub.hereNow(channel, state, disable_uuids, new _cb());
                    break;
            }
        });


    };


    whereNow(...args: any[]): Promise<any> {
        let uuid: string;
        return new Promise((resolve, reject) => {
            let _cb = com.pubnub.api.Callback.extend({
                successCallback: function (channel, message) {
                    resolve({type: 'success', channel: channel, message: helper.deserialize(message)});
                },
                errorCallback: function (channel, message) {
                    reject({type: 'error', channel: channel, message: helper.deserialize(message)});
                }
            });

            switch (args.length) {
                case 1:
                    uuid = args[0];
                    this.pubnub.whereNow(uuid, new _cb());
                    break;
                default:
                    this.pubnub.whereNow(new _cb());
                    break;
            }
        });
    };

    presence(channel: string): Promise<any> {
        return new Promise((resolve, reject) => {
            let _cb = com.pubnub.api.Callback.extend({
                connectCallback: function (channel, message) {
                    resolve({type: 'connect', channel: channel, message: helper.deserialize(message)});
                },
                disconnectCallback: function (channel, message) {
                    resolve({type: 'disconnect', channel: channel, message: helper.deserialize(message)});
                },
                reconnectCallback: function (channel, message) {

                    resolve({type: 'reconnect', channel: channel, message: helper.deserialize(message)});
                },
                successCallback: function (channel, message) {
                    resolve({type: 'success', channel: channel, message: helper.deserialize(message)});
                },
                errorCallback: function (channel, message) {
                    reject({type: 'error', channel: channel, message: helper.deserialize(message)});
                }
            });
            this.pubnub.presence(channel, new _cb());
        });
    };

    get uuid(): string {
        return this._config.getUuid();
    };

    setAuthKey(key: string) {
        this.pubnub.setAuthKey(key);
    };

    getAuthKey(): string {
        return this.pubnub.getAuthKey();
    };

    unsetAuthKey() {
        this.pubnub.unsetAuthKey();
    };

    setFilter(filter: string) {
        this.pubnub.filer(filter);
    };

    getFilter() {
        return this.pubnub.getFilter();
    };

    getState(channel: string, uuid: string): Promise<any> {
        return new Promise((resolve, reject) => {
            let _cb = com.pubnub.api.Callback.extend({
                successCallback: function (channel, message) {
                    resolve({type: 'success', channel: channel, message: helper.deserialize(message)});
                },
                errorCallback: function (channel, message) {
                    reject({type: 'error', channel: channel, message: helper.deserialize(message)});
                }
            });
            this.pubnub.getState(channel, uuid, new _cb());
        });
    };

    setState(channel: string, uuid: string, state): Promise<any> {
        return new Promise((resolve, reject) => {
            if (typeof state === 'object' && Boolean(state)) {
                let _cb = com.pubnub.api.Callback.extend({
                    successCallback: function (channel, message) {
                        resolve({type: 'success', channel: channel, message: helper.deserialize(message)});
                    },
                    errorCallback: function (channel, message) {
                        reject({type: 'error', channel: channel, message: helper.deserialize(message)});
                    }
                });
                let _state = helper.serialize(state);

                this.pubnub.setState(channel, uuid, _state, new _cb());

            }
        });
    };

    history(...args: any[]): Promise<any> {
        let channel = args[0];
        let start;
        let end;
        let count;
        let reverse;
        let includeTimetoken;
        return new Promise((resolve, reject) => {
            let _cb = com.pubnub.api.Callback.extend({
                successCallback: function (channel, message) {
                    resolve({type: 'success', channel: channel, message: helper.deserialize(message)})
                },
                errorCallback: function (channel, message) {
                    reject({type: 'error', channel: channel, message: helper.deserialize(message)})
                }
            });

            switch (args.length) {
                case 2:
                    if (typeof args[1] === 'number') {
                        count = args[1];
                        this.pubnub.history(channel, count, new _cb());
                    } else if (typeof args[1] === 'boolean') {
                        reverse = args[1];
                        this.pubnub.history(channel, reverse, new _cb());
                    }
                    break;
                case 3:
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
                case 4:
                    if ((typeof args[2] === 'number' && args[1] <= 100) && typeof args[3] === 'boolean') {

                        start = args[1];
                        count = args[2];
                        reverse = args[3];

                        this.pubnub.history(channel, start, count, reverse, new _cb());
                    } else if ((typeof args[2] === 'number' && args[1] > 100) && (typeof args[1] === 'number' && args[3] <= 100)) {

                        start = args[1];
                        end = args[2];
                        count = args[3];

                        this.pubnub.history(channel, start, end, count, new _cb());
                    }
                    break;
                case 6:
                    start = args[1];
                    end = args[2];
                    count = args[3];
                    reverse = args[4];
                    includeTimetoken = args[5];
                    this.pubnub.history(channel, start, end, count, reverse, includeTimetoken, new _cb());
                    break;
            }
        });
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

    channelGroupAddChannel(...args: any[]): Promise<any> {
        let group = args[0];
        let channel;
        let channels;
        return new Promise((resolve, reject) => {
            let _cb = com.pubnub.api.Callback.extend({
                successCallback: function (channel, message) {
                    resolve({type: 'success', channel: channel, message: helper.deserialize(message)});
                },
                errorCallback: function (channel, message) {
                    reject({type: 'error', channel: channel, message: helper.deserialize(message)});
                }
            });

            switch (args.length) {
                case 2:
                    if (typeof args[1] === 'string') {
                        channel = args[1];
                        this.pubnub.channelGroupAddChannel(group, channel, new _cb());
                    } else if (Array.isArray(channels)) {
                        channels = Array.create(java.lang.String, args[1].length);
                        args[1].forEach((item, key) => {
                            channels[key] = item;
                        });
                        this.pubnub.channelGroupAddChannel(group, channels, new _cb());
                    }
                    break;
            }
        });
    };

    pamGrant(...args: any[]): Promise<any> {
        let channel: string = args[0];
        let auth_key;
        let read: boolean;
        let write: boolean;
        let int: number;
        return new Promise((resolve, reject) => {
            let _cb = com.pubnub.api.Callback.extend({
                successCallback: function (channel, message) {
                    resolve({type: 'success', channel: channel, message: helper.deserialize(message)});
                },
                errorCallback: function (channel, message) {
                    reject({type: 'error', channel: channel, message: helper.deserialize(message)});
                }
            });

            switch (args.length) {
                case 3:
                    read = args[1];
                    write = args[2];
                    this.pubnub.pamGrant(channel, read, write, new _cb());
                    break;
                case 4:
                    if (typeof args[1] === 'string' && typeof args[1] === 'boolean') {
                        auth_key = args[1];
                        read = args[2];
                        write = args[3];
                        this.pubnub.pamGrant(channel, auth_key, read, write, new _cb());
                    } else if (typeof args[1] === 'boolean' && typeof args[3] === 'number') {
                        read = args[1];
                        write = args[2];
                        int = args[3];
                        this.pubnub.pamGrant(channel, read, write, int, new _cb());
                    }
                    break;
                case 6:
                    auth_key = args[1];
                    read = args[2];
                    write = args[3];
                    int = args[4];
                    this.pubnub.pamGrant(channel, auth_key, read, write, int, new _cb());
                    break;
            }
        });
    };

    pamAuditChannelGroup(...args: any[]): Promise<any> {
        let group: String = args[0];
        let auth_key: string;
        return new Promise((resolve, reject) => {
            let _cb = com.pubnub.api.Callback.extend({
                successCallback: function (channel, message) {
                    resolve({type: 'success', channel: channel, message: helper.deserialize(message)});
                },
                errorCallback: function (channel, message) {
                    reject({type: 'error', channel: channel, message: helper.deserialize(message)});
                }
            });

            switch (args.length) {
                case 1:
                    this.pubnub.pamAuditChannelGroup(group, new _cb());
                    break;
                case 2:
                    auth_key = args[1];
                    this.pubnub.pamAuditChannelGroup(group, auth_key, new _cb());
                    break;
            }
        });


    };

    pamGrantChannelGroup(...args: any[]): Promise<any> {
        let group: String = args[0];
        let auth_key: string;
        let read: boolean;
        let management: boolean;
        let ttl: number;
        return new Promise((resolve, reject) => {
            let _cb = com.pubnub.api.Callback.extend({
                successCallback: function (channel, message) {
                    resolve({type: 'success', channel: channel, message: helper.deserialize(message)});
                },
                errorCallback: function (channel, message) {
                    reject({type: 'error', channel: channel, message: helper.deserialize(message)});
                }
            });

            switch (args.length) {
                case 3:
                    read = args[1];
                    management = args[2];
                    this.pubnub.pamAuditChannelGroup(group, read, management, new _cb());
                    break;
                case 4:
                    if (typeof args[1] === 'boolean' && typeof args[2] === 'boolean' && typeof args[3] === 'number') {
                        read = args[1];
                        management = args[2];
                        ttl = args[3];
                        this.pubnub.pamAuditChannelGroup(group, read, management, ttl, new _cb());
                    } else if (typeof args[1] === 'string' && typeof args[1] === 'boolean' && typeof args[1] === 'boolean') {

                        auth_key = args[1];
                        read = args[2];
                        management = args[3];
                        this.pubnub.pamAuditChannelGroup(group, read, management, ttl, new _cb());
                    }
                    break;
                case 5:
                    auth_key = args[1];
                    read = args[2];
                    management = args[3];
                    ttl = args[4];
                    this.pubnub.pamGrantChannelGroup(group, auth_key, read, management, ttl, new _cb());
                    break;
            }
        });
    };

    channelGroupListChannels(group: string): Promise<any> {
        return new Promise((resolve, reject) => {
            let _cb = com.pubnub.api.Callback.extend({
                successCallback: function (channel, message) {
                    resolve({type: 'success', channel: channel, message: helper.deserialize(message)});
                },
                errorCallback: function (channel, message) {
                    reject({type: 'error', channel: channel, message: helper.deserialize(message)});
                }
            });

            this.pubnub.channelGroupListChannels(group, new _cb());
        });
    };

    channelGroupSubscribe(group: string): Promise<any> {
        return new Promise((resolve, reject) => {
            let _cb = com.pubnub.api.Callback.extend({
                connectCallback: function (channel, message) {
                    resolve({type: 'connect', channel: channel, message: helper.deserialize(message)});
                },
                disconnectCallback: function (channel, message) {
                    resolve({type: 'disconnect', channel: channel, message: helper.deserialize(message)});
                },
                reconnectCallback: function (channel, message) {
                    resolve({type: 'reconnect', channel: channel, message: helper.deserialize(message)});
                },
                successCallback: function (channel, message) {
                    resolve({type: 'success', channel: channel, message: helper.deserialize(message)});
                },
                errorCallback: function (channel, message) {
                    reject({type: 'error', channel: channel, message: helper.deserialize(message)});
                }
            });
            this.pubnub.channelGroupSubscribe(group, new _cb());
        });
    };

    channelGroupRemoveGroup(group: string): Promise<any> {
        return new Promise((resolve, reject) => {
            let _cb = com.pubnub.api.Callback.extend({
                successCallback: function (channel, message) {
                    resolve({type: 'success', channel: channel, message: helper.deserialize(message)});
                },
                errorCallback: function (channel, message) {
                    reject({type: 'error', channel: channel, message: helper.deserialize(message)});
                }
            });
            this.pubnub.channelGroupRemoveGroup(group, new _cb());
        });
    };

    channelGroupRemoveChannel(...args: any[]): Promise<any> {
        let group = args[0];
        let channel;
        let channels;
        return new Promise((resolve, reject) => {
            let _cb = com.pubnub.api.Callback.extend({
                successCallback: function (channel, message) {
                    resolve({type: 'success', channel: channel, message: helper.deserialize(message)});
                },
                errorCallback: function (channel, message) {
                    reject({type: 'error', channel: channel, message: helper.deserialize(message)});
                }
            });

            switch (args.length) {
                case 2:
                    if (typeof args[1] === 'string') {
                        channel = args[1];
                        this.pubnub.channelGroupRemoveChannel(group, channel, new _cb());
                    } else if (Array.isArray(args[1])) {
                        channels = Array.create(java.lang.String, args[1].length);
                        args[1].forEach((item, key) => {
                            channels[key] = item;
                        });
                        this.pubnub.channelGroupRemoveChannel(group, channels, new _cb());
                    }
                    break;
            }
        });
    };

    channelGroupSetState(group: string, uuid: string, state: any): Promise<any> {
        return new Promise((resolve, reject) => {
            let _cb = com.pubnub.api.Callback.extend({
                successCallback: function (channel, message) {
                    resolve({type: 'success', channel: channel, message: helper.deserialize(message)});
                },
                errorCallback: function (channel, message) {
                    reject({type: 'error', channel: channel, message: helper.deserialize(message)});
                }
            });
            this.pubnub.channelGroupSetState(group, uuid, helper.serialize(state), new _cb());
        });
    };

    channelGroupUnsubscribe(...args: any[]) {
        if (typeof args[0] === 'string') {
            this.pubnub.channelGroupUnsubscribe(args[0]);
        } else if (Array.isArray(args[0])) {
            let channels = Array.create(java.lang.String, args[0].length);
            args[0].forEach((item, key) => {
                channels[key] = item;
            });
            this.pubnub.channelGroupUnsubscribe(channels);
        }
    };

    unsubscribeAllChannels() {
        this.pubnub.unsubscribeAllChannels();
    };

    shutdown() {
        this.pubnub.shutdown();
    };

    get instance() {
        return this.pubnub;
    };

    set instance(instance) {
        this.pubnub = instance;
    }

}
interface Config {
    subscribeKey: string;
    publishKey?: string;
    secretKey?: string;
    cipher?: string;
    uuid?: string;
    verbosity?: string;
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