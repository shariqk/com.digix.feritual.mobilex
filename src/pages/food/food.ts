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

/*
  async initialize() {
    let toast = this.toastCtrl.create({
        message: 'Please wait...',
        position: 'top'
      });
    toast.present();

    try {
      let pos = await this.geolocation.getCurrentPosition({timeout: 20000, enableHighAccuracy: false});
      //this.latitude = pos.coords.latitude;
      //this.longitude = pos.coords.longitude;
    }
    catch {
      //this.latitude = 40.034804;
      //this.longitude = -75.301198;
    }

    try {

      this.currentAddress = await this.getAddressFromLatLng(this.latitude, this.longitude);
      //this.currentAddress = address;
      //console.log(this.currentAddress);

      let search = new FoodSearch(this.api, this.eatstreetApi);
      let locations = await search.getLocationsAsync(this.latitude, this.longitude);

      this.locations = locations;
      this.placeholderText = this.locations.length + " places near " + this.currentAddress;
      //console.log(this.locations);
    }
    catch(err) {
      alert('error in getting locations: ' + JSON.stringify(err));
    }
    finally {
      toast.dismiss();
    }

//        search.getLocations(this.latitude, this.longitude)
//          .then(locations => {
//             this.locations = locations;
//             this.placeholderText = "Search for food in "+ this.locations.length + " places nearby";
//             console.log(this.locations);
//             toast.dismiss();
//           }).catch(err => {
//             console.log(err);
//             alert('An error occured in getting locations: ' + JSON.stringify(err));
//             toast.dismiss();
//           });
//         }).catch((err) => {
//           alert('An error occured in getting locations: ' + JSON.stringify(err));
//           console.log('Error getting location', err);
//        });



    //var test = this.api.getLocations(lat,lng).subscribe(result => alert(JSON.stringify(result)));
    //var test2 = this.eatstreetApi.getRestaurants(lat,lng).subscribe(result => alert(JSON.stringify(result)));
  }
*/

  searchCleared() {
    this.results = null;
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
      }
    });

    dialog.present();
  }

  /*
  getAddressFromLatLng(lat : number, lng : number) : Promise<string> {
    var ctx = this;
    return new Promise(function(resolve, reject) {
      ctx.googleApi.reverseGeocodeToPlace(lat, lng)
        .subscribe(
          places => {
            let r = places.results;

            for(let i=0; i<r.length; i++) {
              for(let j=0; j<r[i].types.length;j++) {
                if(r[i].types[j]=='street_address') {
                  resolve(r[i].formatted_address);
                }
              }
            }

            // this is in case we don't find a formatted address
            let mockup = 'lat: ' + lat + ', lng: ' + lng;
            resolve(mockup);
          },
          error => reject(error)
        );
    });
  }
  */

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


  /*
  doSearch(event : any) {
    if(this.nearme==null || this.searchTerm==null || this.searchTerm.length<4) {
      return;
    }

    var brands = new Array();
    for(var l of this.nearme.locations) {
      brands.push(l.brand_id);
    }

    this.api.searchForFood(brands, this.searchTerm)
      .subscribe(data => {
        console.log('results', data);
        //alert('success');
      },
      error =>
      {
        alert(error.message);
        console.log(error);
      });
    }
*/


  /*
  getNextLocationMenuAsync(ctx : LoaderContext) {
    let loc = ctx.next();
    if(loc == null) {
      this.results  = ctx.results;
      return;
    }


    this.api.searchLocationMenu([loc.brand_id], ctx.searchTerm)
      .subscribe(menu => {
        //console.log('menu', menu);
        //console.log('loc: ' + loc.name + ' menu.hits: ' + menu.hits.length);

        if(menu.hits.length>0) {
          ctx.addToSearchResult(menu);
          //const c = this.componentFactoryResolver.resolveComponentFactory(FoodListComponent);
          //let f = this.menucontainer.createComponent(c);
          //f.instance.initialize(loc, menu);
        }
        this.getNextLocationMenuAsync(ctx);

      },
      error =>
      {
        alert(error.message);
        console.log(error);
      });
  }

  getRestaurantMenu(restaurantApiKey : string) {
    this.eatstreetApi.getRestaurantMenu(restaurantApiKey)
      .subscribe(data => {
        console.log('menu', data);
      },
      error =>
      {
        console.log(error);
      });
  }

  getEatstreetRestaurants(lat : number, lng : number) {
    let toast = this.toastCtrl.create({
        message: 'Locating restaurants near you',
        position: 'top'
      });
    toast.present();

    this.eatstreetApi.getRestaurants(lat, lng)
      .subscribe(data => {
        console.log('restaurants', data);
        var res : Restaurant[] = data.restaurants;
        for(var r of res) {
          this.getRestaurantMenu(r.apiKey);
        }

        toast.dismiss();
      },
      error =>
      {
        toast.dismiss();
        alert(error.message);
        console.log(error);
      });
  }


  getLocations() {
    var lat = 40.034804;
    var lng = -75.301198;
    let toast = this.toastCtrl.create({
        message: 'Loading locations near you',
        position: 'top'
      });
    toast.present();

    this.getEatstreetRestaurants(lat, lng);

    this.api.getLocations(lat, lng)
      .subscribe(data => {
        this.nearme = data;
        //console.log('locations', data);
        toast.dismiss();
      },
      error =>
      {
        toast.dismiss();
        alert(error.message);
        console.log(error);
      });
    }
    */
}

/*
export class LoaderContext {
  constructor(locations : FoodLocation[], searchTerm : string) {
    this.locations = locations;
    this.searchTerm = searchTerm;
    this.counter = -1;
    this.processed = [];
    this.results = [];
  }


  public next() : FoodLocation {
    while(this.counter<this.locations.length-1) {
      this.counter++;
      if(this.counter > 20) {
        return null;
      }
      else {
        var skip = false;
        var loc = this.locations[this.counter];
        //console.log('processed', this.processed);
        for(var b in this.processed) {
          if(b==loc.name) {
            console.log('skipping ' + loc.name);
            skip = true;
            break;
          }
        }

        if(!skip) {
          this.processed.push(loc.name);
          return this.locations[this.counter];
        }
      }
    }

    return null;
  }

  addToSearchResult(menu : FoodLocationMenu) : void {
    var result = new SearchResult();
    result.location = this.locations[this.counter];
    result.menu = menu;
    this.results.push(result);
  }

  processed : string[];
  counter : number = -1;
  locations : FoodLocation[] = null;
  public searchTerm : string;
  public results : SearchResult[];
}

export class SearchResult {
  public location : FoodLocation;
  public menu : FoodLocationMenu;
}

*/
