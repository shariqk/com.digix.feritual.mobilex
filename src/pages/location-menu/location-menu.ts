import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';


import { FoodApiProvider } from '../../providers/food-api/food-api';
import { FoodSearchResult } from '../../providers/food-api/food-api.model';

import { EatstreetApiProvider } from '../../providers/eatstreet-api/eatstreet-api';
import { RestaurantMenuNode } from '../../providers/eatstreet-api/eatstreet-api.model';

//import { FxLocation, FxLocationMenu, FxLocationMenuItem, FxLocationType, FxIcons } from '../../providers/models/fxlocation';
import { FoodItem } from '../../providers/food-api/food-api.model';

import { FeritualApiProvider } from '../../providers/feritual-api/feritual-api';
import { FxLocation, FxLocationMenu, FxLocationMenuItem } from '../../providers/feritual-api/feritual-api.model';
import { MenuHelper } from '../../providers/feritual-api/feritual-helper';


@IonicPage()
@Component({
  selector: 'page-location-menu',
  templateUrl: 'location-menu.html',
})
export class LocationMenuPage {

  menu : FxLocationMenu;
  location : FxLocation;

  constructor(public navCtrl: NavController,
    private ferApi : FeritualApiProvider,
    private loadingCtrl : LoadingController,
    public navParams: NavParams) {
  }

  async initialize(loc : FxLocation) {
    let loading = this.loadingCtrl.create({
       content: 'Please wait...'
     });
    loading.present();

    try {
      let menus = await this.ferApi.getLocationMenuAsync(loc.id, loc.type);
      let menu = menus[0];
      MenuHelper.fixMenuPhotoUrl(menu);
      this.menu = menu;
      this.location = loc;
    }
    catch(err) {
      alert('Error in loading menu:' + JSON.stringify(err));
    }
    finally {
      loading.dismiss();
    }
  }


  ionViewDidLoad() {
    if(this.menu==null) {
      var loc = this.navParams.get('location');
      this.initialize(loc);

    }

  }

}
