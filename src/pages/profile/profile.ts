import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';

import { UserprofileApiProvider } from '../../providers/userprofile-api/userprofile-api';
import { UserProfile, UserProfileOptions, KeyValueItem } from '../../providers/userprofile-api/userprofile.model';

import { FitbitApiProvider } from '../../providers/fitbit-api/fitbit-api';
import { FitBitAccessTokenModel } from '../../providers/fitbit-api/fitbit-api.model';


@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  profile : UserProfile;
  options : UserProfileOptions;

  avoids : KeyValueItem[];
  diets : KeyValueItem[];
  initialized : boolean;
  pref = 'avoids';

  token_fitbit : FitBitAccessTokenModel = null;

  constructor(public navCtrl: NavController,
    public http : HttpClient,
    private viewCtrl: ViewController,
    private fitbitApi : FitbitApiProvider,
    private loadingCtrl : LoadingController,
    private profileApi : UserprofileApiProvider,
    public navParams: NavParams) {

      this.initialize();
  }

  async initialize() {
    let loading = this.loadingCtrl.create({
       content: 'Please wait...'
     });
    loading.present();

    try {
      let p =  this.navParams.get('profile');
      this.profile = JSON.parse(JSON.stringify(p));
      //console.log('profile', this.profile);

      this.token_fitbit = await this.fitbitApi.GetLoginToken();

      this.options = await this.profileApi.getUserProfileOptionsAsync();
      //console.log('user profile options', this.options);


      this.mergeArrays(this.options.cuisines, this.profile.cuisines);

      this.diets = this.createKeyValueItemArray(this.options.diets, this.profile.diets);
      this.avoids = this.createKeyValueItemArray(this.options.avoids, this.profile.avoids);

      this.initialized = true;
    }
    catch(err) {
      alert('Error in loading menu:' + JSON.stringify(err));

    }
    finally {
      loading.dismiss();
    }
  }

  createKeyValueItemArray(keys : string[], selections : string[]) : KeyValueItem[] {
    let list : KeyValueItem[] = [];

    for(let k of keys) {
      list.push({
        key: k,
        value: (selections.indexOf(k)>=0)
      });
    }

    return list;
  }

  getSelectedKeys(items : KeyValueItem[]) : string[] {
    let list : string[] = [];

    for(let item of items) {
      if(item.value) {
        list.push(item.key);
      }
    }

    return list;
  }

  mergeArrays(parentList : string[], childList : string[]) {
    //console.log('parentList', parentList);
    //console.log('parentList.length', parentList.length);
    //console.log('child', childList);
    //console.log('child.length', childList.length);

    // first remove all the items from the child that are not in the parent
    for(let i=childList.length-1; i>=0; i--) {
      //console.log('i', i, childList[i]);
      let item = childList[i];
      //console.log('loc', parentList.indexOf(item));
      if(parentList.indexOf(item)<0) {
        //console.log('Removing', item);
        childList.splice(i, 1);
      }
    }

    // then append all items to the array that are in parent but not in the child
    for(let p of parentList) {
      if(childList.indexOf(p)<0) {
        childList.push(p);
      }
    }


  }


  /*

  itemSelectionChange(items : string[], key : string, data : any) {
    let loc = items.indexOf(key);
    if(data.checked && loc<0) {
      items.push(key);
    }
    else if (!data.checked && loc>=0) {
        items.splice(loc, 1);
    }
  }

  */

  reorderItems = function(items, indexes) {
    let element = items[indexes.from];
    items.splice(indexes.from, 1);
    items.splice(indexes.to, 0, element);
  }

  async cancelEdit() {
    this.viewCtrl.dismiss(null);
  }

  async saveProfile() {
    //console.log('diets', this.diets);
    this.profile.diets = this.getSelectedKeys(this.diets);
    this.profile.avoids = this.getSelectedKeys(this.avoids);

    //console.log('profile to save', this.profile);

    this.viewCtrl.dismiss(this.profile);
  }


  async connectToFitBit() {
    try {
      let token = await this.fitbitApi.LoginImplicit();

      this.token_fitbit = token;
    }
    catch(err) {
      alert('Something unexpected happened.  Please retry to see if the problem is resolved');
    }
    finally {

    }
  }

  async disconnectFromFitBit() {
    if(confirm("Are you sure you want to disconnect your profile with Fitbit?")) {
      await this.fitbitApi.ClearLoginToken();
      this.token_fitbit = null;
    }
  }


  ionViewDidLoad() {
  }

}
