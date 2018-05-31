import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { UserProfile, UserProfileAllergies } from '../../providers/userprofile-api/userprofile.model';
import { UserprofileApiProvider } from '../../providers/userprofile-api/userprofile-api';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  profile : UserProfile;
  inEditMode : boolean;

  constructor(public navCtrl: NavController,
    public http : HttpClient,
    private profileApi : UserprofileApiProvider,
    public navParams: NavParams) {
  }

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

  reorderItems(indexes) {
    let c = this.profile.cuisine.Items;

    let element = c[indexes.from];
    c.splice(indexes.from, 1);
    c.splice(indexes.to, 0, element);

    //console.log('c', c);
  }

  async cancelEdit() {
    this.profile = await this.profileApi.loadUserProfile(); // read back from storage
    this.inEditMode = false;
  }

  editProfile() {
    this.inEditMode = true;
  }

  async saveProfile() {
    await this.profileApi.saveUserProfile(this.profile);
    this.inEditMode = false;
  }




  ionViewDidLoad() {
    if(this.profile==null) {
      this.initialize();
    }
  }

}
