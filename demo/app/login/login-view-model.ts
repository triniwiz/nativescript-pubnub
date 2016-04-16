import {Observable} from 'data/observable';
import {PubNub} from 'nativescript-pubnub';
export class LoginViewModel extends Observable {
    pubnub: PubNub;
    user: User;
    constructor() {
        super();
        this.user = { username: '', channel: '' }
        this.pubnub = new PubNub("demo", "demo", true);
    }
    login() {
        if (this.user.username.length > 0 && this.user.channel.length > 0) {
            this.pubnub.setUUID(this.user.username);
            this.pubnub.subscribe(this.user.channel, function (cb) {
                console.dump(cb)
            });
        }

    }
}

interface User {
    username: string;
    channel: string;
}