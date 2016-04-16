# nativescript-pubnub
##WIP

##Usage
tns plugin add https://github.com/triniwiz/nativescript-pubnub;

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
.subscribe(channel,callback:Function);

.subscribe(channel:String,callback:Function, timetoken:Number)

.subscribe(channel:String, callback:Function, timetoken:String)

.subscribe(channels:String[], callback:Function, timetoken:String)

.subscribe(channels:String[], callback:Function, timetoken:Number)

.subscribe(channels:String[], callback:Function)
```

###Publish

Use any of the following methods to publish data;

>Message Data:
The message argument can contain any JSON serializable data, including: Objects, Arrays, Ints and Strings.


```js
.publish(channel: String, message: any, storeInHistory: Boolean, metadata:String, callback:Function);
.publish(channel: String, message: any, storeInHistory: Boolean, callback:Function);
.publish(channel: String, message: any, metadata, callback:Function);
.publish(channel: String, message: any, callback:Function)
```

###History
Use any of the following methods to retrieve pubnub's history;
```js
.history(channel, count, callback);
.history(channel, reverse, callback);
.history(channel, start, end, callback);
.history(channel, count, reverse, callback);
.history(channel, start, reverse, callback);
.history(channel, start, count, callback);
.history(channel, includeTimetoken, count, callback);
.history(channel, start, count, reverse, callback);
.history(channel, start, end, count, callback);
.history(channel, start, end, count, reverse, includeTimetoken, callback);
.history(channel: String, start: Number, end: Number, count: Number, reverse: Boolean, includeTimetoken: Boolean, callback:Function);
 ```
###Unsubscribe
```js
.unsubscribe(channels);
.unsubscribe(channels: String)
```

###Here Now
```js
.hereNow(channel: String, state, disable_uuids, callback);
.hereNow(state: String, disable_uuids: Boolean, callback);
.hereNow(channel: String, callback)
    
```
###Grant
```js
.pamGrant(channel: String, auth_key: String, read: Boolean, write: Boolean, int: number, callback)
.pamGrant(channel: String, auth_key: String, read: Boolean, write: Boolean, callback)
.pamGrant(channel: String, read: Boolean, write: Boolean, int: number, callback)
.pamGrant(channel: String, read: Boolean, write: Boolean, callback)
.pamGrant(channel, auth_key, read, write, int, callback)
```
###Add Channels to Channel Group   
```js
.channelGroupAddChannel(group: String, channels, callback)
.channelGroupAddChannel(group: String, channels, callback)
```

###Where Now
```js
.whereNow(uuid: String, callback: () => void)
.whereNow(callback: () => void)
```

###Audit Channel Group
```js
.pamAuditChannelGroup(group, callback);
.pamAuditChannelGroup(group, auth_key, callback);   
```
###Channel Group Grant
```js
.pamGrantChannelGroup(group, auth_key, read, management, ttl, callback);
.pamGrantChannelGroup(group, auth_key, read, management, callback);
.pamGrantChannelGroup(group, read, management, ttl, callback);
.pamGrantChannelGroup(group, read, management, callback)
```
###Remove Channel Group
```js
.channelGroupRemoveChannel(group, channels, callback)
.channelGroupRemoveChannel(group, channel: String, callback)
```