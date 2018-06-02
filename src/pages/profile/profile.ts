import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';

import { UserProfile } from '../../providers/userprofile-api/userprofile.model';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  profile : UserProfile;

  constructor(public navCtrl: NavController,
    public http : HttpClient,
    private viewCtrl: ViewController,
    public navParams: NavParams) {

      let p =  this.navParams.get('profile');
      this.profile = JSON.parse(JSON.stringify(p));
  }

  /*
  async initialize() {
    let profile = await this.profileApi.loadUserProfile();
    if(profile==null) {
      //console.log('creating new profile');
      profile = new UserProfile();
      await this.profileApi.saveUserProfile(profile);
    }
    this.profile = profile;
    //console.log('profile', this.profile);
  }
  */

  reorderItems(indexes) {
    let c = this.profile.cuisine.Items;

    let element = c[indexes.from];
    c.splice(indexes.from, 1);
    c.splice(indexes.to, 0, element);
  }

  async cancelEdit() {
    this.viewCtrl.dismiss(null);
  }

  async saveProfile() {
    this.viewCtrl.dismiss(this.profile);
  }




  ionViewDidLoad() {
  }

}
