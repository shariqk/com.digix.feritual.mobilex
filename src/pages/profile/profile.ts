import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { UserProfile, UserProfileAllergies } from '../../providers/feritual-api/userprofile.model';


@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  profile  = new UserProfile();
  inEditMode : boolean;

  constructor(public navCtrl: NavController,
    public http : HttpClient,
    public navParams: NavParams) {
  }

  reorderItems(indexes) {
    let c = this.profile.cuisine.Items;

    let element = c[indexes.from];
    c.splice(indexes.from, 1);
    c.splice(indexes.to, 0, element);

    //console.log('c', c);
  }

  ionViewDidLoad() {
    console.log(this.profile);
    /*
    var url = 'assets/mocks/mcdonalds.json';

    var result = this.http.get(url)
      .map(res => <object>res)
      .subscribe(json => console.log(json));
    */
  }

}
