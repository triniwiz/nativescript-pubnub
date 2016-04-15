# nativescript-pubnub
###WIP

###Usage
tns plugin add https://github.com/triniwiz/nativescript-pubnub;


```ts
import {PubNub} from 'nativescript-pubnub';
let pubnub = new PubNub("pubKey","subKey");
```
```
var pubNub = require('nativescript-pubnub');
var pubnub = new pubNub.PubNub("pubKey","subKey")
```


subscribe
```ts
pubnub.subscribe("channelName",callback);
```

publish 
>Message Data:
The message argument can contain any JSON serializable data, including: Objects, Arrays, Ints and Strings. Message data should not contain special Android classes or functions as these will not serialize. String content can include any single-byte or multi-byte UTF-8 character.

```ts
pubnub.publish("channelName",data,callback);
```


 history
```ts
pubnub. history("channelName", 50, callback)
```

unsubscribe
```ts
pubnub.unsubscribe("channelName");
```
