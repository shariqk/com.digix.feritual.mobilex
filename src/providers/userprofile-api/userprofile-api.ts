import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage, StorageConfig } from '@ionic/storage';

import { UserProfile } from './userprofile.model';

@Injectable()
export class UserprofileApiProvider {

  constructor(
    public http: HttpClient,
    private storage : Storage) {
  }

  _profileStorageKeyName='user.profile';

  public loadUserProfile() : Promise<UserProfile> {
    return new Promise((resolve, reject) => {
        this.storage.get(this._profileStorageKeyName)
          .then((json) => {
            if(json == null || json=='') {
              resolve(null);
            }
            else {
              //console.log('loaded', json);
              let token = JSON.parse(json);
              resolve(token);
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
