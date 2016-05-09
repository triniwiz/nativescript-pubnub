import {Observable} from 'data/observable';
import {PubNub} from 'nativescript-pubnub';
import settings = require("application-settings");
import frame = require("ui/frame");
const pubKey = "demo";
const subKey = "demo";
let pubnub = new PubNub(pubKey, subKey, true);
export class LoginViewModel extends Observable {
    user: User;
    constructor() {
        super();
        this.user = { username: 'nsChatUser', channel: 'nsChatDemo' };
    }
    login() {
        if (this.user && this.user.username && this.user.channel) {
            pubnub.setUUID(this.user.username);
            settings.setString("uuid", this.user.username);
            settings.setString("channel", this.user.channel);
            pubnub.subscribe(this.user.channel)
                .then((cb,item) => {
                    this.goToMain();
                })
                .catch((err) => {
                    console.log(err.message)
                });
        }

    }
    goToMain() {
        frame.topmost().navigate({ moduleName: "chat/chat", context: { instance: pubnub.instance } })
    }
}

interface User {
    username: string;
    channel: string;
}