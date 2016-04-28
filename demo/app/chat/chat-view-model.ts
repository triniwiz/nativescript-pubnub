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
    this.message = { body: '', from: '' };
    this.msgList = new ObservableArray();
  }
  sendMessage() {
    this.message.from = this.pubnub.getUUID();
    this.pubnub.publish(channel, this.message, (cb) => {
      this.msgList.push(this.message);
      this.message = { body: '', from: '' };
    })
  }
  getMessages() {
    this.pubnub.history(channel, 100, (cb) => {
      cb.message[0].forEach((item) => {
        this.msgList.push(item);
      })
    })
  }
  set instance(i) {
    this.pubnub = new PubNub(i);
  }
  subToHome() {
    this.pubnub.subscribe(channel, (cb) => {
      console.dump(cb)
    });
  }
}

export interface Message {
  body: string;
  from: string;
}
