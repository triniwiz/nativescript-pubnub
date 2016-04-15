import * as observable from 'data/observable';
import * as pages from 'ui/page';
const myPub = "demo";
const mySub = "demo";
import {HelloWorldModel} from './main-view-model';
import {PubNub} from 'nativescript-pubnub';
// Event handler for Page "loaded" event attached in main-page.xml
export function pageLoaded(args: observable.EventData) {
    // Get the event sender
    var page = <pages.Page>args.object;
    page.bindingContext = new HelloWorldModel();
}

let pubnub = new PubNub(myPub, mySub);
pubnub.setUUID("triniwiz")
pubnub.subscribe("triniwiz_home", function (cb) {
 // console.dump(cb)
})
pubnub.publish("triniwiz_home", "Testing from nativescript", function (cb) {
  //  console.dump(cb.message)
})
pubnub.history("triniwiz_home",true,function (cb) {
    console.dump(cb)
})

/*pubnub.setState('triniwiz',"triniwiz" ,{"firstName":"Osei","lastName":"Fortune"},function(cb){
    console.dump(cb)
})*/

/*pubnub.getState('triniwiz_home',"triniwiz",function(cb){
    console.dump(cb)
})*/
/*pubnub.time(function (cb) {
   // console.dump(cb.message)
})
pubnub.subscribe("triniwiz", function (cb) {
  console.dump(cb)
})

pubnub.publish("triniwiz", "Testing from nativescript", function (cb) {
  //  console.dump(cb.message)
})

pubnub.hereNow("triniwiz",function(cb){
  //  console.dump(cb.message)
})

pubnub.getState('triniwiz',pubnub.getUUID(),function(cb){
    console.dump(cb)
})

let pubnub2 = new PubNub(myPub,mySub);
pubnub2.time(function (cb) {
   // console.dump(cb.message)
})
pubnub2.subscribe("triniwiz", function (cb) {
  console.dump(cb)
})

pubnub2.publish("triniwiz", "2nd Instance", function (cb) {
  //  console.dump(cb.message)
})

pubnub2.hereNow("triniwiz",function(cb){
  //  console.dump(cb.message)
})

pubnub2.getState('triniwiz',pubnub2.getUUID(),function(cb){
    console.dump(cb)
})*/
