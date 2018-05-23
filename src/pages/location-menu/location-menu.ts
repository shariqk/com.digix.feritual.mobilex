import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { FoodApiProvider } from '../../providers/food-api/food-api';
import { EatstreetApiProvider } from '../../providers/eatstreet-api/eatstreet-api';
import { FxLocation, FxLocationMenu, FxLocationMenuItem } from '../../providers/models/fxlocation';


@IonicPage()
@Component({
  selector: 'page-location-menu',
  templateUrl: 'location-menu.html',
})
export class LocationMenuPage {

  location : FxLocation;

  constructor(public navCtrl: NavController,
    public nxApi : FoodApiProvider,
    public esApi : EatstreetApiProvider,
    public navParams: NavParams) {

  }

  async initialize(loc : FxLocation) {
    if(loc.type=='nx')
    {
      let m = await this.nxApi.getRestaurantMenuV2Async(loc.name);
    }
    else {
      let m = await this.esApi.getRestaurantMenu(loc.id);
    }
  }

  ionViewDidLoad() {
    if(this.location==null) {
      var loc = this.navParams.get('location');
      this.initialize(loc);

    }

  }

}
