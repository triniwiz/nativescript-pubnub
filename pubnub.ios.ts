import common = require('./pubnub.common');

declare var PNConfiguration;
declare var PubNub;
export class TNSPubNub extends common.TNSPubNub {
    private _pubnub: any;
    private _pubKey: string;
    private _subKey: string;
    private _config:any; 
    constructor(config:common.TNSPubNubConfiguration) {
        super();
        this._config = PNConfiguration.configurationWithPublishKey(config.publishKey).subscribeKey(config.subscribeKey);
        if(config.uuid){
            this._config.uuid = config.uuid;
        }
        if(config.secure){
            this._config.TLSEnabled = config.secure;
        }
        this._pubnub = PubNub.clientWithConfiguration(this._config);
    }

    get instance(){
        return this._pubnub;
    }

    set instance(value:any){
        this._pubnub = value;
    }
}