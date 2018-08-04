import { Component, ViewChild  } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, Content } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { UserprofileApiProvider } from '../../providers/userprofile-api/userprofile-api';

//import { FoodApiProvider } from '../../providers/food-api/food-api';
//import { FoodSearchResult } from '../../providers/food-api/food-api.model';

//import { EatstreetApiProvider } from '../../providers/eatstreet-api/eatstreet-api';
//import { RestaurantMenuNode } from '../../providers/eatstreet-api/eatstreet-api.model';

//import { FxLocation, FxLocationMenu, FxLocationMenuItem, FxLocationType, FxIcons } from '../../providers/models/fxlocation';
//import { FoodItem } from '../../providers/food-api/food-api.model';

import { FeritualApiProvider } from '../../providers/feritual-api/feritual-api';
import { FxLocation, FxLocationMenu, FxLocationMenuItem } from '../../providers/feritual-api/feritual-api.model';
import { MenuHelper, Helper } from '../../providers/feritual-api/feritual-helper';
import { UserProfile } from '../../providers/userprofile-api/userprofile.model';

@IonicPage()
@Component({
  selector: 'page-location-menu',
  templateUrl: 'location-menu.html',
})
export class LocationMenuPage {

  searchTerm: string;
  menu : FxLocationMenu;
  location : FxLocation;
  showAllItems: false;
  @ViewChild(Content) content: Content;

  constructor(public navCtrl: NavController,
    private ferApi : FeritualApiProvider,
    private loadingCtrl : LoadingController,
    private profileApi: UserprofileApiProvider,
    private alertCtrl: AlertController,
    public navParams: NavParams) {
  }

  async initialize(loc : FxLocation, profile : UserProfile, refresh : boolean) {
    let loading = this.loadingCtrl.create({
       content: 'Please wait...'
     });
    loading.present();

    try {
      let menus = await this.ferApi.getLocationMenuAsync(loc.id, loc.provider, refresh, profile);
      let menu = menus[0];
      MenuHelper.fixMenuPhotoUrl(menu);
      this.menu = menu;
      this.location = loc;
      console.log('menu', this.menu);
    }
    catch(err) {
      console.log(err);
      this.presentAlert("Error", "An expected error has occured while loading the location menu. Please wait a few minutes and try again.")
      this.navCtrl.pop();
    }
    finally {
      loading.dismiss();
    }
  }

  searchMenuItems() {
    let term = this.searchTerm.toLowerCase();
    //console.log('term', term);

    for(let c of this.menu.categories) {
      for(let i of c.items)
      {
        i.hidden = !(i.name.toLowerCase().indexOf(term) >= 0);
      }
    }

  }

  formatDistance(distance : number) : string {
    return distance.toFixed(2) + ' mi';
  }

  scrollToTop() {
    this.content.scrollTo(0,0);
  }

  concatStrArray(items : string[]) : string {
    return Helper.concatStrArray(items);
  }


  async refreshData(refresher: any) {
    try {
      let loc = this.navParams.get('location');
      let profile = await this.profileApi.loadUserProfile();
      //console.log('profile', profile);
      let refresh = (refresher != null);
      await this.initialize(loc, profile, refresh);
    }
    finally {
      if(refresher != null) {
        refresher.complete();
      }
    }
  }

  ionViewDidLoad() {
    if(this.menu==null) {
      this.refreshData(null);
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

}
