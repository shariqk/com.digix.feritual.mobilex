import { Component , ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

import { FoodApiProvider } from '../../providers/food-api/food-api';
import { FoodListComponent } from '../../components/food-list/food-list'
import { LocationSearchResult, FoodLocation, FoodLocationMenu } from '../../providers/food-api/food-api.model';
import { EatstreetApiProvider } from '../../providers/eatstreet-api/eatstreet-api';
import { Restaurant } from '../../providers/eatstreet-api/eatstreet-api.model';
import { FoodSearch, FxLocation, FxLocationMenu } from './foodSearch';

@IonicPage()
@Component({
  selector: 'page-food',
  templateUrl: 'food.html',
})
export class FoodPage {
  nearme : LocationSearchResult;
  searchTerm : string;
  results : FxLocationMenu[];
  placeholderText = 'name of food or cuisine (say Thai or Burger)';
  //foodSearch : FoodSearch;

  locations : FxLocation[];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    private eatstreetApi : EatstreetApiProvider,
    public api : FoodApiProvider) {
  }

  ionViewDidLoad() {
    if(this.locations==null) {
      this.initialize();
    }
  }

  async initialize() {
    let toast = this.toastCtrl.create({
        message: 'Please wait...',
        position: 'top'
      });
    toast.present();

    var lat = 40.034804;
    var lng = -75.301198;

    let search = new FoodSearch(this.api, this.eatstreetApi);
    this.locations = await search.getLocations(lat, lng);
    this.placeholderText = "Search for food in "+ this.locations.length + " places nearby";
    console.log(this.locations);

    toast.dismiss();
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
