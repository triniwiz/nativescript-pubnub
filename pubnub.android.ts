import common = require('./pubnub.common');
import helper = require('./helpers/jsonHelper');
export class PubNub extends common.PubNub {
    pubKey;
    subKey;
    pubnub;
    
    constructor(pubKey: string, subKey: string, enableSSL: boolean, secretKey, cipherKey) {
        super();
        this.pubKey = pubKey;
        this.subKey = subKey;
        this.pubnub = new com.pubnub.api.Pubnub(pubKey, subKey);
    }


    subscribe(channels: string, callback: () => void) {
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
            if (Array.isArray(channels) || typeof channels === 'string') {
                try {
                    this.pubnub.subscribe(channels, new _cb());
                    resolve();
                } catch (ex) {
                    reject(ex)
                }
            }
        })

    }


    publish(channel: string, message: any, callback: () => void) {
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
                this.pubnub.publish(channel, helper.serialize(message), new _cb());
                resolve();
            } catch (ex) {
                reject(ex)
            }

        })
    };

    time(callback: () => void) {
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
    unsubscribe(channel: string) {
        return new Promise((resolve, reject) => {
            try {
                this.pubnub.unsubscribe();
                resolve();
            }
            catch (ex) {
                reject(ex)
            }
        })
    };
    hereNow(channel: string, callback: () => void) {
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
                this.pubnub.hereNow(channel, new _cb());
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
    }
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

    /*TODO */ /*history(channel:string, start:number, end:number, count:number, reverse:boolean, includeTimetoken, callback);
    history(channel:string, includeTimetoken, count:number, callback);
    history(channel:string, start:number, end:number, count:number, callback);
    history(channel:string, start:number, count:number, reverse:boolean, callback);
    history(channel:string, start:number, count:number, callback);
    history(channel:string, start:number, reverse:boolean, callback);
    history(channel:string, count:number, reverse:boolean, callback);
    history(channel:string, start:number, end:number, callback);
    history(channel:string, reverse, callback);*/
    history(channel: string, count: number, callback) {
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
                this.pubnub.history(channel, count, new _cb());
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

}