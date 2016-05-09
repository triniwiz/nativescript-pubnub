import {Observable} from 'data/observable';
import {PubNub} from 'nativescript-pubnub';
import settings = require("application-settings");
const uuid = settings.getString("uuid");
const channel = settings.getString("channel");
import {ObservableArray} from 'data/observable-array';
export class ChatViewModel extends Observable {
  message: Message;
  msgList;
  pubnub;
  constructor() {
    super();
    this.set("message", { body: '', from: '' });
    this.msgList = new ObservableArray();
  }
  sendMessage() {
    if (this.get("message").body.length > 0) {
      this.message.from = this.pubnub.getUUID();
      this.pubnub.publish(channel, this.get("message"))
        .then((cb) => {
          this.msgList.push(this.message);
      // this.set("message", { body: '', from: '' });
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }
  getMessages() {
    this.msgList.splice(0);
    this.pubnub.history(channel, 100)
      .then((cb) => {
        cb.message[0].forEach((item) => {
          this.msgList.push(item);
        })
      })
      .catch((err) => {
        console.log(err)
      })
  }
  set instance(i) {
    this.pubnub = new PubNub(i);
  }
  subToHome() {
    this.pubnub.subscribe(channel);
  }
}

export interface Message {
  body: string;
  from: string;
}
