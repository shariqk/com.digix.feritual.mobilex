import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { UserProfile, UserProfileOptions } from './userprofile.model';

@Injectable()
export class UserprofileApiProvider {
  baseUrl = 'https://comdigixferitualwebapi.azurewebsites.net/api/feritual';

  constructor(
    public http: HttpClient,
    private storage : Storage) {
  }

  public getUserProfileOptionsAsync() : Promise<UserProfileOptions> {
    var ctx = this;
    return new Promise(function(resolve, reject) {
      let url = ctx.baseUrl + '/userprofileoptions';

      ctx.http.get(url)
        .map(res => <UserProfileOptions>res)
        .subscribe(
          options => {
            resolve(options)
          },
          error => { console.log('getUserProfileOptions', error); reject(error); }
        );
    });
  }

  _profileStorageKeyName='user.profile';

  public loadUserProfile() : Promise<UserProfile> {
    return new Promise((resolve, reject) => {
        this.storage.get(this._profileStorageKeyName)
          .then((json) => {
            if(json == null || json=='') {
              resolve(new UserProfile());
            }
            else {
              //console.log('loaded', json);
              let profile = JSON.parse(json);
              console.log('profile', profile);
              UserProfile.validate(profile);
              resolve(profile);
            }
          });
        });
  }

  public saveUserProfile(profile : UserProfile) : Promise<UserProfile> {
    return new Promise((resolve, reject) => {
      //console.log(profile);
      var data = (profile==null) ? null : JSON.stringify(profile);
      this.storage.set(this._profileStorageKeyName, data)
      .then(() => {
        //console.log('data saved');
        resolve(profile);
      });
    });

  }
}
