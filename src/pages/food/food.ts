import { Component , ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ModalController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

import { FoodApiProvider } from '../../providers/food-api/food-api';
import { FoodListComponent } from '../../components/food-list/food-list'
import { LocationSearchResult, FoodLocation, FoodLocationMenu } from '../../providers/food-api/food-api.model';
import { EatstreetApiProvider } from '../../providers/eatstreet-api/eatstreet-api';
import { Restaurant } from '../../providers/eatstreet-api/eatstreet-api.model';
import { FoodSearch } from './foodSearch';
import { FxLocation, FxLocationMenu } from '../../providers/models/fxlocation';
import { LocationMenuPage } from '../../pages/location-menu/location-menu';


import { GoogleApiProvider } from '../../providers/google-api/google-api';
import { PlaceAddress, GoogleLocation } from '../../providers/google-api/google-api.model';
import { AddressPickerPage } from '../../pages/address-picker/address-picker';

@IonicPage()
@Component({
  selector: 'page-food',
  templateUrl: 'food.html',
})
export class FoodPage {
  //nearme : LocationSearchResult;
  searchTerm : string;
  results : FxLocationMenu[];
  placeholderText = 'name of food or cuisine (say Thai or Burger)';
  currentLocation : GoogleLocation;
  locations : FxLocation[];

  constructor(public navCtrl: NavController,
    public modalCtrl : ModalController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    private geolocation: Geolocation,
    private googleApi : GoogleApiProvider,
    private eatstreetApi : EatstreetApiProvider,
    public api : FoodApiProvider) {

      this.currentLocation = new GoogleLocation();
      this.currentLocation.address = 'Tap here to get started';
  }

  ionViewDidLoad() {

  }

  searchCleared() {
    this.results = null;
  }

  formatDistance(distance : number) : string {
    return distance.toFixed(2) + ' m';
  }

  navigateToLocationMenu(loc : FxLocation)
  {
    this.navCtrl.push(LocationMenuPage,
      {
        location : loc
      });
  }

  async getLocations(loc : GoogleLocation)
  {
    let toast = this.toastCtrl.create({
        message: 'Please wait...',
        position: 'top'
      });
    toast.present();

    try {
      let search = new FoodSearch(this.api, this.eatstreetApi);
      let locations = await search.getLocationsAsync(loc.lat, loc.lng);

      this.currentLocation = loc;
      this.locations = locations;
      this.placeholderText = 'Search in ' + this.locations.length + ' places (e.g., Sushi or Burger)';
      //console.log(this.locations);
    }
    catch(err) {
      alert('error in getting locations: ' + JSON.stringify(err));
    }
    finally {
      toast.dismiss();
    }

  }

  addressCardClicked(event : any) {
    let dialog = this.modalCtrl.create(AddressPickerPage,
      {
        address: this.currentLocation.address
      },
      {
        showBackdrop : true
      });

    dialog.onDidDismiss(loc => {
      if(loc != null) {
        this.getLocations(loc);
        this.results = null;
      }
    });

    dialog.present();
  }


  async doLocationMenuSearch(event : any) {
    if(this.searchTerm==null || this.searchTerm.length<4) {
        return;
    }

    let toast = this.toastCtrl.create({
        message: 'Searching...',
        position: 'top'
      });
    toast.present();

    var search = new FoodSearch(this.api, this.eatstreetApi);
    this.results = await search.search(this.locations, this.searchTerm);
    //console.log(this.results);
    toast.dismiss();
  }

}
