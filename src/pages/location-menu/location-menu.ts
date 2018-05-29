import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';


import { FoodApiProvider } from '../../providers/food-api/food-api';
import { FoodSearchResult } from '../../providers/food-api/food-api.model';

import { EatstreetApiProvider } from '../../providers/eatstreet-api/eatstreet-api';
import { RestaurantMenuNode } from '../../providers/eatstreet-api/eatstreet-api.model';

import { FxLocation, FxLocationMenu, FxLocationMenuItem, FxLocationType, FxIcons } from '../../providers/models/fxlocation';
import { FoodItem } from '../../providers/food-api/food-api.model';

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
      let nxMenu = await this.nxApi.getRestaurantMenuV2Async(loc.name);
      this.menu = this.fromNxToFxMenu(loc, nxMenu);
    }
    else if(loc.type==FxLocationType.provider_type_es) {
      let esMenu = await this.esApi.getRestaurantMenuAsync(loc.id);
      this.menu = this.fromEsToFxMenu(loc, esMenu);
    }
  }

  fromEsToFxMenu(loc: FxLocation, menu: RestaurantMenuNode[]) : FxLocationMenu {
    let m = new FxLocationMenu();
    m.location = loc;
    m.items = [];
    for(var category of menu) {
      for(var item of category.items) {
          let i = new FxLocationMenuItem();
          i.calories = -1; // estimated
          i.name = item.name;
          i.description = item.description;
          i.photoUrl = FxIcons.getIcon(i.name);
          console.log('item', i);

          m.items.push(i);
      }
    }

    return m;
  }

  fromNxToFxMenu(loc : FxLocation, menu : FoodSearchResult) : FxLocationMenu {
    let m = new FxLocationMenu();
    m.location = loc;
    m.items = [];

    var list : FoodItem[] = [];
    if(menu.branded!=null) { list = list.concat(menu.branded); }
    if(menu.common!=null) { list = list.concat(menu.common); }
    if(menu.self!=null) { list = list.concat(menu.self); }

    for(var item of list) {
      let i = new FxLocationMenuItem();
      //console.log('processing: ' + i);
      i.calories = item.nf_calories;
      i.name = item.food_name;
      i.photoUrl = (item.photo.thumb == null) ? FxIcons.generic_icon_url : item.photo.thumb;
      //console.log(i);

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
