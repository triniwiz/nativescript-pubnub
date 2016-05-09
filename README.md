[![npm](https://img.shields.io/npm/v/nativescript-pubnub.svg)](https://www.npmjs.com/package/nativescript-pubnub)
[![npm](https://img.shields.io/npm/dt/nativescript-pubnub.svg?label=npm%20downloads)](https://www.npmjs.com/package/nativescript-pubnub)
# nativescript-pubnub

##Usage
tns plugin add nativescript-pubnub

##Android

###Initialize

Using Typescript
```js
import {PubNub} from 'nativescript-pubnub';
```
Using javascript
```js
var pn = require('nativescript-pubnub');
var pubnub = new pn.PubNub("pubKey","subKey");
```

Use any of the following methods to initialize PubNub;
```js
new PubNub(pubKey: String, subKey: String);

new PubNub(pubKey: String, subKey: String, enableSSL: Boolean);

new PubNub(pubKey: String, subKey: String, secretKey: String);

new PubNub(pubKey: String, subKey: String, secretKey: String, enableSSL: Boolean);

new PubNub(pubKey: String, subKey: String, secretKey: String, cipherKey: String, enableSSL: Boolean);

new PubNub(pubKey: String, subKey: String, secretKey: String, cipherKey: String, enableSSL: Boolean, iv: String);
```

    
###Subscribe

Use any of the following methods to subscribe to a channel or multiple channels;

```js
.subscribe(channel): Promise;

.subscribe(channel:String,timetoken:Number): Promise

.subscribe(channel:String, timetoken:String): Promise

.subscribe(channels:String[], timetoken:String): Promise

.subscribe(channels:String[], timetoken:Number): Promise

.subscribe(channels:String[] ): Promise
```

###Publish

Use any of the following methods to publish data;

>Message Data:
The message argument can contain any JSON serializable data, including: Objects, Arrays, Ints and Strings.


```js
.publish(channel: String, message: any, storeInHistory: Boolean, metadata:String): Promise;
.publish(channel: String, message: any, storeInHistory: Boolean): Promise;
.publish(channel: String, message: any, metadata): Promise;
.publish(channel: String, message: any): Promise;
```

###History
Use any of the following methods to retrieve pubnub's history;
```js
.history(channel, count): Promise;
.history(channel, reverse): Promise;
.history(channel, start, end): Promise;
.history(channel, count, reverse): Promise;
.history(channel, start, reverse): Promise;
.history(channel, start, count): Promise;
.history(channel, includeTimetoken, count): Promise;
.history(channel, start, count, reverse): Promise;
.history(channel, start, end, count): Promise;
.history(channel, start, end, count, reverse, includeTimetoken): Promise;
.history(channel: String, start: Number, end: Number, count: Number, reverse: Boolean, includeTimetoken: Boolean): Promise;
 ```
###Unsubscribe
```js
.unsubscribe(channels);
.unsubscribe(channels: String)
```

###Here Now
```js
.hereNow(channel: String, state, disable_uuids): Promise;
.hereNow(state: String, disable_uuids: Boolean): Promise;
.hereNow(channel: String): Promise;
    
```
###Grant
```js
.pamGrant(channel: String, auth_key: String, read: Boolean, write: Boolean, int: number): Promise;
.pamGrant(channel: String, auth_key: String, read: Boolean, write: Boolean): Promise;
.pamGrant(channel: String, read: Boolean, write: Boolean, int: number): Promise;
.pamGrant(channel: String, read: Boolean, write: Boolean): Promise;
.pamGrant(channel, auth_key, read, write, int): Promise;
```
###Add Channels to Channel Group   
```js
.channelGroupAddChannel(group: String, channels): Promise;
.channelGroupAddChannel(group: String, channels): Promise;
```

###Where Now
```js
.whereNow(uuid: String): Promise;
.whereNow(): Promise;
```

###Audit Channel Group
```js
.pamAuditChannelGroup(group): Promise;
.pamAuditChannelGroup(group, auth_key): Promise;   
```
###Channel Group Grant
```js
.pamGrantChannelGroup(group, auth_key, read, management, ttl): Promise;
.pamGrantChannelGroup(group, auth_key, read, management): Promise;
.pamGrantChannelGroup(group, read, management, ttl): Promise;
.pamGrantChannelGroup(group, read, management): Promise;
```
###Remove Channel Group
```js

.channelGroupRemoveChannel(group, channels): Promise;
.channelGroupRemoveChannel(group, channel: String): Promise;
```