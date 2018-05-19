import { Observable } from 'rxjs/Observable';

import { FoodApiProvider } from '../../providers/food-api/food-api';
import { FoodListComponent } from '../../components/food-list/food-list'
import { LocationSearchResult, FoodLocation, FoodLocationMenu } from '../../providers/food-api/food-api.model';
import { EatstreetApiProvider } from '../../providers/eatstreet-api/eatstreet-api';
import { Restaurant, RestaurantMenuNode } from '../../providers/eatstreet-api/eatstreet-api.model';


export class FoodSearch {
  provider_type_nx = 'nx';
  provider_type_es = 'es';
  results : FxLocationMenu[];

  public constructor(
    public nxApi : FoodApiProvider,
    public eatstreetApi : EatstreetApiProvider)
  {  }

  //public locations : FxLocation[];
  //public menus : FxLocationMenu[];
  //public isReady = false;

  /*
  public initialize = function(lat : number, lng : number) : Promise<FoodSearch> {
    let ctx = this;
    return new Promise(function(resolve, reject) {
      ctx.locations = [];
      ctx.getEatstreetRestaurants(ctx, lat, lng)
        .then(function() {
          ctx.getNxLocations(ctx, lat, lng)
        })
        .then(function() {
          ctx.isReady = true;
          console.log('ctx', ctx);
          resolve(ctx);
        })
        .catch(err => reject(err));
    });
  }
  */

  public getLocations = async function(lat : number, lng : number) : Promise<FxLocation[]> {
    var locations : FxLocation[] = [];
    let esLocations = await this.getEatstreetRestaurants(this, lat, lng);
    locations = locations.concat(esLocations);

    let nxLocations = await this.getNxLocations(this, lat, lng);
    locations = locations.concat(nxLocations);

    return locations;
  }


  public search = async function(locations: FxLocation[], query : string) : Promise<FxLocationMenu[]> {
    var ctx : FoodSearch = this;
    var results : FxLocationMenu[] = [];
    //console.log('locations-to-process', locations);

    for(var i=0; i<locations.length-1; i++) {
      var loc = locations[i];
      //console.log('index: ', i + ' of ' + locations.length, 'processing: ', loc);
      var menu : FxLocationMenu = null;
      if(loc.type==this.provider_type_es) {
         menu = await ctx.searchEatstreetMenu(ctx, loc, query);
         //console.log('menu', menu);
      }
      else if(loc.type==this.provider_type_nx) {
        try {
          //menu = await this.searchNxLocationMenu(ctx, loc, query);

        }
        catch(e) {
            console.log('Exception', e);
        }
      }
      else {
        console.log('ignoring: ' + loc);
      }

      if(menu!=null && menu.items.length>0)
      {
        results.push(menu);
      }
    }

    return results;
  }


  async searchEatstreetMenu(ctx : FoodSearch, loc: FxLocation, query : string) : Promise<FxLocationMenu> {
    let menu = await ctx.getEatStreetRestaurantMenu(ctx, loc.id);
    //console.log(loc.name + ' menu', menu);

    let m = new FxLocationMenu();
    m.location = loc;
    m.items = [];

    for(var category of menu) {
      for(var item of category.items) {
        if(item.name.indexOf(query)>=0) {
          let i = new FxLocationMenuItem();
          i.calories = -1; // estimated
          i.name = item.name;
          i.description = item.description;
          console.log('item', i);

          m.items.push(i);
        }
      }
    }

    return m;
  }

  getEatStreetRestaurantMenu = function(ctx : FoodSearch, restaurantApiKey : string) : Promise<RestaurantMenuNode[]> {
    return new Promise(function(resolve, reject) {
      ctx.eatstreetApi.getRestaurantMenu(restaurantApiKey)
        .subscribe(data => {
          console.log(restaurantApiKey, data);
          resolve(data);
        },
        error =>
        {
          console.log(error);
          reject(error);
        });
    });
  }

  getEatstreetRestaurants = function(ctx : FoodSearch, lat : number, lng : number) : Promise<FxLocation[]> {
    return new Promise(function(resolve, reject) {
      ctx.eatstreetApi.getRestaurants(lat, lng)
        .subscribe(data => {
          //console.log('getEatstreetRestaurants.data', data);

          var res : Restaurant[] = data.restaurants;
          var list = ctx.fromEatstreetToNx(res);
          //ctx.locations = ctx.locations.concat(list);
          resolve(list);
        },
        error =>
        {
          console.log(error);
          reject(error);
        });
    });
  }

  fromEatstreetToNx(restaurants : Restaurant[]) : FxLocation[]
  {
    var list : FxLocation[] = [];

    for(var res of restaurants) {
      var fx = new FxLocation();
      fx.id = res.apiKey;
      fx.name = res.name;
      fx.lat = res.latitude;
      fx.lng = res.longitude;
      fx.type = this.provider_type_es;

      list.push(fx);
    }

    return list;
  }

  searchNxLocationMenu = function(ctx : FoodSearch, loc : FxLocation, query : string) : Promise<FxLocationMenu> {
    return new Promise(function(resolve, reject) {
      ctx.nxApi.searchLocationMenu([loc.id], query)
        .subscribe(data => {
          console.log('getNxLocations.data', data);
          var menu : FoodLocationMenu = data;
          let m = new FxLocationMenu();
          m.location = loc;
          m.items = [];

          for(var item of menu.hits) {
            let i = new FxLocationMenuItem();
            i.calories = item.fields.nf_calories;
            i.name = item.fields.item_name;
            i.description = item.fields.item_description;

            m.items.push(i);
          }

          return m;
        },
        error =>
        {
          console.log(error);
          reject(error);
        });
    });
  }

  getNxLocations = function(ctx : FoodSearch, lat : number, lng : number) : Promise<FxLocation[]> {
    return new Promise(function(resolve, reject) {
      ctx.nxApi.getLocations(lat, lng)
        .subscribe(data => {
          //console.log('getNxLocations.data', data);
          var result : LocationSearchResult = data;
          var list = ctx.fromNxToFx(result.locations);
          //ctx.locations = ctx.locations.concat(list);
          resolve(list);
          //console.log(this.locations);
        },
        error =>
        {
          console.log(error);
          reject(error);
        });
    });
  }

  fromNxToFx(locations : FoodLocation[]) : FxLocation[]
  {
      var list : FxLocation[] = [];
      for(var loc of locations) {
        var fx = new FxLocation();
        fx.id = loc.brand_id;
        fx.name = loc.name;
        fx.lng = loc.lng;
        fx.lat = loc.lat;
        fx.type = this.provider_type_nx;

        list.push(fx);
      }

      return list;
  }

}


export class FxLocation {
  public id : string;
  public name : string;
  public lat : number;
  public lng : number;
  public type : string;
}

export class FxLocationMenu {
  location : FxLocation;
  items : FxLocationMenuItem[];
}

export class FxLocationMenuItem {
  name : string;
  description : string;
  calories : number;
}
