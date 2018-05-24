import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { FoodApiProvider } from '../../providers/food-api/food-api';
import { FoodSearchResult } from '../../providers/food-api/food-api.model';

import { EatstreetApiProvider } from '../../providers/eatstreet-api/eatstreet-api';
import { FxLocation, FxLocationMenu, FxLocationMenuItem, FxLocationType } from '../../providers/models/fxlocation';


@IonicPage()
@Component({
  selector: 'page-location-menu',
  templateUrl: 'location-menu.html',
})
export class LocationMenuPage {

  menu : FxLocationMenu;

  constructor(public navCtrl: NavController,
    public nxApi : FoodApiProvider,
    public esApi : EatstreetApiProvider,
    public navParams: NavParams) {

  }

  async initialize(loc : FxLocation) {
    if(loc.type==FxLocationType.provider_type_nx)
    {
      let m = await this.nxApi.getRestaurantMenuV2Async(loc.name);
      this.menu = this.fromNxToFxMenu(loc, m);
    }
    else if(loc.type==FxLocationType.provider_type_es) {
      let m = await this.esApi.getRestaurantMenu(loc.id);
    }
  }

  fromNxToFxMenu(loc : FxLocation, menu : FoodSearchResult) : FxLocationMenu {
    let m = new FxLocationMenu();
    m.location = loc;
    m.items = [];

    for(var item of menu.items()) {
      let i = new FxLocationMenuItem();
      //console.log('processing: ' + i);
      i.calories = item.nf_calories;
      i.name = item.food_name;
      //i.description = item.;

      m.items.push(i);
    }

    //console.log('resolving to m: ' + m);
    return m;
  }

  ionViewDidLoad() {
    if(this.menu==null) {
      var loc = this.navParams.get('location');
      this.initialize(loc);

    }

  }

}
