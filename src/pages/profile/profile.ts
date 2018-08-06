import { Component } from '@angular/core';
import { Platform, IonicPage, NavController, NavParams, ViewController, LoadingController, AlertController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';

import { UserprofileApiProvider } from '../../providers/userprofile-api/userprofile-api';
import { UserProfile, UserProfileOptions, KeyValueItem, NuitrionFilter, NuitrionFilterItem } from '../../providers/userprofile-api/userprofile.model';

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
  nuitrionFilters: NuitrionFilterItem[] = [];

  constructor(public navCtrl: NavController,
    public http : HttpClient,
    private viewCtrl: ViewController,
    private alertCtrl: AlertController,
    private fitbitApi : FitbitApiProvider,
    private loadingCtrl : LoadingController,
    private profileApi : UserprofileApiProvider,
    private platform : Platform,
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

      let promise = this.profileApi.getUserProfileOptionsAsync();

      this.token_fitbit = await this.fitbitApi.GetLoginToken();

      if (this.token_fitbit==null && this.platform.is('mobileweb')) {
        // This will only print when on a browser in test mode
        this.token_fitbit = await this.fitbitApi.GetTestLoginToken();
      }

      if(this.token_fitbit!=null) {
        try {
          let fb = await this.fitbitApi.GetUserProfile(this.token_fitbit);
          console.log('profile', fb);
        }
        catch(ex) {
          console.log(ex);
          if(ex.error !=null && ex.error.errors!=null && ex.error.errors.length>0 &&
            ex.error.errors[0]=="Authorization Error: Invalid authorization token type")
          {
            // token has expired
          }

          this.fitbitApi.ClearLoginToken();
          this.token_fitbit = null;
        }
      }

      this.options = await promise; // this.profileApi.getUserProfileOptionsAsync();
      //console.log('user profile options', this.options);

      this.nuitrionFilters = NuitrionFilter.objects();
      for(let n of this.profile.nuitrionFilters) {
        if(n.selected) {
          for(let nf of this.nuitrionFilters) {
            if(nf.key==n.key) {
              nf.selected = true;
              nf.minValue = n.minValue;
              nf.maxValue = n.maxValue;
              break;
            }
          }
        }
      }

      this.mergeArrays(this.options.cuisines, this.profile.cuisines);

      this.diets = this.createKeyValueItemArray(this.options.diets, this.profile.diets);
      this.avoids = this.createKeyValueItemArray(this.options.avoids, this.profile.avoids);

      this.initialized = true;
    }
    catch(err) {
      console.log(err);
      this.presentAlert('Error', 'An unexpected error occured during initialization of the profile editor. Please wait a few minutes and retry.');
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

    this.profile.nuitrionFilters = [];
    for(let nf of this.nuitrionFilters) {
      if(nf.selected && nf.maxValue>0) {
        this.profile.nuitrionFilters.push(nf);
      }
    }

    console.log('profile to save', this.profile);

    this.viewCtrl.dismiss(this.profile);
  }


  async connectToFitBit() {
    try {
      let token = await this.fitbitApi.LoginImplicit();

      this.token_fitbit = token;
    }
    catch(err) {
      console.log(err);
      this.presentAlert('Error', 'An error occured during logging into Fitbit. Please wait a few minutes and retry.');
    }
    finally {

    }
  }

  async disconnectFromFitBit() {
    if(confirm("Are you sure you want to disconnect your profile from Fitbit?")) {
      await this.fitbitApi.ClearLoginToken();
      this.token_fitbit = null;
    }
  }

  presentAlert(title: string, text: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }

  ionViewDidLoad() {
  }

}
