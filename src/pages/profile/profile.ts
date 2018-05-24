import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  constructor(public navCtrl: NavController,
    public http : HttpClient,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    var url = 'assets/mocks/mcdonalds.json';

    var result = this.http.get(url)
      .map(res => <object>res)
      .subscribe(json => console.log(json));
  }

}
