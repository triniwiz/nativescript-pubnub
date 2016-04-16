import common = require('./pubnub.common');
import helper = require('./helpers/jsonHelper');
export class PubNub extends common.PubNub {
    pubKey: string;
    subKey: string;
    pubnub;

    constructor(...args: any[]) {
        super();
        this.pubKey = args[0];
        this.subKey = args[1];
        let enableSSL;
        let secretKey;
        let cipherKey;
        let iv;
        switch (arguments.length) {
            case 2:
                if (typeof this.pubKey === 'string' && typeof this.subKey === 'string') {
                    this.pubnub = new com.pubnub.api.Pubnub(this.pubKey, this.subKey);
                }
                break;
            case 3:
                if (typeof arguments[2] === 'boolean') {
                    enableSSL = args[2];
                    this.pubnub = new com.pubnub.api.Pubnub(this.pubKey, this.subKey, enableSSL);
                } else if (typeof arguments[2] === 'string') {
                    secretKey = args[2];
                    this.pubnub = new com.pubnub.api.Pubnub(this.pubKey, this.subKey, secretKey);
                }
                break;
            case 4:
                secretKey = args[2];
                enableSSL = args[3];
                this.pubnub = new com.pubnub.api.Pubnub(this.pubKey, this.subKey, secretKey, enableSSL);
                break;
            case 5:
                secretKey = args[2];
                cipherKey = args[3];
                enableSSL = args[4];
                this.pubnub = new com.pubnub.api.Pubnub(this.pubKey, this.subKey, secretKey, cipherKey, enableSSL);
                break;
            case 6:
                secretKey = args[2];
                cipherKey = args[3];
                enableSSL = args[4];
                iv = args[5];
                this.pubnub = new com.pubnub.api.Pubnub(this.pubKey, this.subKey, secretKey, cipherKey, enableSSL, iv);
                break;
        }



    };

    subscribe(...args: any[]) {
        let callback = args[1];
        let channels: string[];
        let channel: string;
        let timetoken;
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
                console.dump(message)
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

                        if (typeof args[0] === 'string') {
                            channel = args[0];
                            this.pubnub.subscribe(helper.serialize(channel), new _cb());
                        } else if (Array.isArray(args[0])) {
                            channels = args[0]; //TODO fix change args[0] to String[];
                            this.pubnub.subscribe(helper.serialize(channels), new _cb());
                        }
                        break;
                    case 3:
                        timetoken = args[2]
                        if (typeof args[2] === 'number') {
                            channel = args[0];
                            this.pubnub.subscribe(channel, new _cb(), timetoken);
                        } else if (typeof args[2] === 'string') {
                            channel = args[0];
                            this.pubnub.subscribe(channel, new _cb(), timetoken);
                        } else if (Array.isArray(args[0]) && typeof args[2] === 'string') {
                            channels = args[0];
                            this.pubnub.subscribe(channels, new _cb(), timetoken);
                        } else if (Array.isArray(args[0]) && typeof args[2] === 'number') {
                            channels = args[0];
                            this.pubnub.subscribe(channels, new _cb(), timetoken);
                        }
                        break;

                }
                resolve();
            } catch (ex) {
                reject(ex)
            }

        })

    };

    publish(...args: any[]) {
        let channel = args[0];
        let message = args[1];
        let callback = args[args.length - 1];
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
                        this.pubnub.publish(channel, helper.serialize(message), new _cb());
                        break;
                    case 4:
                        if (typeof args[2] === 'object') {
                            let metadata = args[2];
                            this.pubnub.publish(channel, helper.serialize(message), helper.serialize(metadata), new _cb());
                        } else if (typeof args[2] === 'boolean') {
                            let storeInHistory = args[2];
                            this.pubnub.publish(channel, helper.serialize(message), storeInHistory, new _cb());
                        }
                        break;
                    case 5:
                        let metadata = args[3];
                        let storeInHistory = args[2];
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

    unsubscribe(...args: any[]) {
        let channel;
        let channels;
        return new Promise((resolve, reject) => {
            try {
                if (Array.isArray(args[0])) {
                    channels = args[0];
                    this.pubnub.unsubscribe(channels);
                } else if (typeof args[0] === 'string') {
                    channel = args[0];
                    this.pubnub.unsubscribe(channel);
                }
                resolve();
            }
            catch (ex) {
                reject(ex)
            }
        })
    };

    unsubscribeAll() {
        this.pubnub.unsubscribeAll();
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
                this.pubnub.hereNow(true, true, new _cb());
                resolve();
            } catch (ex) {
                reject(ex)
            }

        })
    };

    hereNow(...args: any[]) {
        let callback = args[args.length - 1];
        let channel;
        let state;
        let disable_uuids;
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
                        channel = args[0];
                        this.pubnub.hereNow(channel, new _cb());
                        break;
                    case 3:
                        state = args[0];
                        disable_uuids = args[1];
                        this.pubnub.hereNow(state, disable_uuids, new _cb());
                        break;
                    case 4:
                        channel = args[0];
                        state = args[1];
                        disable_uuids = args[2];
                        this.pubnub.hereNow(channel, state, disable_uuids, new _cb());
                        break;
                }

                resolve();
            } catch (ex) {
                reject(ex)
            }

        })
    };


    whereNow(...args: any[]) {
        let callback = args[args.length - 1];
        let uuid: string;
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
                    case 1:
                        this.pubnub.whereNow(new _cb());
                        break;
                    case 2:
                        uuid = args[1];
                        this.pubnub.whereNow(uuid, new _cb());
                        break;
                }

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

    setAuthKey(key: string) {
        this.pubnub.setAuthKey(key);
    };

    getAuthKey() {
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

    };

    history(...args: any[]) {
        let callback = args[args.length - 1];
        let channel = args[0];
        let start;
        let end;
        let count;
        let reverse;
        let includeTimetoken;
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
                            this.pubnub.history(channel, count, new _cb());
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
                    case 7:
                        start = args[1];
                        end = args[2];
                        count = args[3];
                        reverse = args[4];
                        includeTimetoken = args[5];
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

    channelGroupAddChannel(...args: any[]) {
        let callback = args[args.length - 1];
        let group = args[0];
        let channel;
        let channels;
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
                            channel = args[1];
                            this.pubnub.channelGroupAddChannel(group, channel, new _cb());
                        } else if (Array.isArray(channels)) {
                            channels = args[1];
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

    pamGrant(...args: any[]) {
        let callback = args[args.length - 1];
        let channel: string = args[0];
        let auth_key;
        let read: boolean;
        let write: boolean;
        let int: number;
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
                        read = args[1];
                        write = args[2];
                        this.pubnub.pamGrant(channel, read, write, new _cb());
                        break;
                    case 5:
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
                resolve();
            } catch (ex) {
                reject(ex);
            }
        })

    };

    pamAuditChannelGroup(...args: any[]) {
        let callback = args[args.length - 1];
        let group: String = args[0];
        let auth_key: string;

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
                        this.pubnub.pamAuditChannelGroup(group, new _cb());
                        break;
                    case 3:
                        auth_key = args[1];
                        this.pubnub.pamAuditChannelGroup(group, auth_key, new _cb());
                        break;
                }
                resolve();
            } catch (ex) {
                reject(ex);
            }
        })
    };

    pamGrantChannelGroup(...args: any[]) {
        let callback = args[args.length - 1];
        let group: String = args[0];
        let auth_key: string;
        let read: boolean;
        let management: boolean;
        let ttl: number;
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
                        read = args[1];
                        management = args[2];
                        this.pubnub.pamAuditChannelGroup(group, read, management, new _cb());
                        break;
                    case 5:
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
                    case 6:
                        auth_key = args[1];
                        read = args[2];
                        management = args[3];
                        ttl = args[4];
                        this.pubnub.pamGrantChannelGroup(group, auth_key, read, management, ttl, callback);
                        break;
                }
                resolve();
            } catch (ex) {
                reject(ex);
            }
        })
    };

    channelGroupListChannels(group: string, callback) {
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
                this.pubnub.channelGroupListChannels(group, callback);
                resolve();
            } catch (ex) {
                reject(ex)
            }

        })
    };

    channelGroupSubscribe(group: string, callback) {
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
                this.pubnub.channelGroupSubscribe(group, callback);
                resolve();
            } catch (ex) {
                reject(ex)
            }

        })
    };

    channelGroupRemoveGroup(group: string, callback) {
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
                this.pubnub.channelGroupRemoveGroup(group, callback);
                resolve();
            } catch (ex) {
                reject(ex)
            }

        })
    };

    channelGroupRemoveChannel(...args: any[]) {
        let group = args[0];
        let callback = args[args.length - 1];
        let channel;
        let channels;
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
                            channel = args[1];
                            this.pubnub.channelGroupRemoveChannel(group, channel, callback);
                        } else if (Array.isArray(args[1])) {
                            channels = args[1];
                            this.pubnub.channelGroupRemoveChannel(group, channels, callback);
                        }
                        break;
                }

                resolve();
            } catch (ex) {
                reject(ex)
            }

        })
    };

    channelGroupSetState(group: string, uuid: string, state: any, callback) {

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
                this.pubnub.channelGroupSetState(group, uuid, helper.serialize(state), new _cb());
                resolve();
            } catch (ex) {
                reject(ex)
            }

        })

    };

    channelGroupUnsubscribe(...args: any[]) {
        if (typeof args[0] === 'string') {
            this.pubnub.channelGroupUnsubscribe(args[0]);
        } else if (Array.isArray(args[0])) {
            this.pubnub.channelGroupUnsubscribe(args[0]);
        }
    };

    unsubscribeAllChannels() {
        this.pubnub.unsubscribeAllChannels();
    };
    
    shutdown(){
        this.pubnub.shutdown();
    }

}