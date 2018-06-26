import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';
import { FitBitAccessTokenModel, FitBitProfileModel, FitBitActivityModel } from './fitbit-api.model';
import { Storage } from '@ionic/storage';

@Injectable()
export class FitbitApiProvider {

  _fitBitClientId : string = '2289CP';
  _fitBitClientSecret = '1c061bf1234e803edc187c939eff3914';
  _fitBitAuthCodeFlowUrl = 'https://www.fitbit.com/oauth2/authorize?response_type=code&scope=activity%20nutrition%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight';
  _fitBitImplicitGrantUrl = 'https://www.fitbit.com/oauth2/authorize?response_type=token&scope=activity%20nutrition%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight';
  _fitBitRedirectUrl = 'http://localhost/callback';

  _storageKeyName : string = 'fitbit.token.json';

  _options : InAppBrowserOptions = {
    location : 'no',//Or 'no'
    hidden : 'no', //Or  'yes'
    clearcache : 'yes',
    clearsessioncache : 'yes',
    zoom : 'yes',//Android only ,shows browser zoom controls
    hardwareback : 'yes',
    mediaPlaybackRequiresUserAction : 'no',
    shouldPauseOnSuspend : 'no', //Android only
    closebuttoncaption : 'Close', //iOS only
    disallowoverscroll : 'no', //iOS only
    toolbar : 'no', //iOS only
    enableViewportScale : 'no', //iOS only
    allowInlineMediaPlayback : 'no',//iOS only
    presentationstyle : 'pagesheet',//iOS only
    fullscreen : 'yes',//Windows only
  };

  constructor(public http: HttpClient,
    private storage: Storage,
    private iab: InAppBrowser) {
  }

  public GetTestLoginToken() : Promise<FitBitAccessTokenModel> {
    let url = 'http://localhost/callback#access_token=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIyRlczNzciLCJhdWQiOiIyMjg5Q1AiLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJ3aHIgd251dCB3cHJvIHdzbGUgd3dlaSB3c29jIHdzZXQgd2FjdCB3bG9jIiwiZXhwIjoxNTMxNTc3OTk4LCJpYXQiOjE1MDAwNDU4OTF9.UKILbwtQoqwW6fTT1pO2hTeKekyKMLncPtz8yZdALNw&user_id=2FW377&scope=sleep+settings+nutrition+activity+social+heartrate+profile+weight+location&token_type=Bearer&expires_in=31532107';
    let token = this.parseImplicitGrant(url);
    return Promise.resolve(token);
  }


  public GetLoginToken() : Promise<FitBitAccessTokenModel> {
    return new Promise((resolve, reject) => {
        this.storage.get(this._storageKeyName)
          .then((json) => {
            if(json == null || json=='') {
              resolve(null);
            }
            else {
              let token = JSON.parse(json);
              resolve(token);
            }
          });

    });
  }

  public ClearLoginToken() : Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.storage.set(this._storageKeyName, "")
        .then(() => {
          Promise.resolve(true);
        });
    });
  }

  public LoginImplicit() : Promise<FitBitAccessTokenModel> {
      const grantUrl : string = this._fitBitImplicitGrantUrl +
                  '&client_id=' + this._fitBitClientId +
                  '&expires_in=31536000' + // 1 year
                  '&redirect_uri=' + this._fitBitRedirectUrl;

      return new Promise((resolve, reject) => {
            console.log('**url', grantUrl);
            let browser = this.openWithInAppBrowser(grantUrl);
            let listener = browser.on('loadstart').subscribe((event: any) => {
                console.log(event.url);

                //Ignore the authorize screen
                if(event.url.indexOf('://www.fitbit.com/') > -1){
                  console.log('ignoring the fitbit screens');
                  return;
                }

                //Check the redirect uri
                if(event.url.indexOf(this._fitBitRedirectUrl) > -1) {
                  listener.unsubscribe();
                  browser.close();

                  let token = this.parseImplicitGrant(event.url);

                  console.log('(*) token', token);

                  this.storage.set(this._storageKeyName, JSON.stringify(token))
                    .then(() => {
                      resolve(token);
                    });
                }
                else {
                  reject("Could not authenticate");
                }
          });

      });;

  }

  private parseImplicitGrant(fitbitImplicitGrantUrl : string) : FitBitAccessTokenModel {
    let url = new URL(fitbitImplicitGrantUrl);
    let token = new FitBitAccessTokenModel();
    token.access_token = url.hash.split('=')[1].split('&')[0];

    let q = fitbitImplicitGrantUrl.substr(fitbitImplicitGrantUrl.indexOf('&'));

    token.user_id = this.getQueryVariable(q, 'user_id');
    token.token_type = this.getQueryVariable(q, 'token_type');
    token.expires_in = Number(this.getQueryVariable(q, 'expires_in'));

    console.log('(*) token', token);

    return token;
  }

  private getQueryVariable(query : string, key : string) : string
  {
     var vars = query.split("&");
     for (var i=0;i<vars.length;i++) {
         var pair = vars[i].split("=");
         if(pair[0] == key){ return pair[1]; }
     }
     return('');
  }


  private openWithSystemBrowser(url : string) : any {
        let target = "_system";
        return this.iab.create(url,target,this._options);
    }

  private openWithInAppBrowser(url : string) : any {
        let target = "_blank";
        return this.iab.create(url,target,this._options);
    }

  private openWithCordovaBrowser(url : string) : any {
        let target = "_self";
        return this.iab.create(url,target,this._options);
    }
}
