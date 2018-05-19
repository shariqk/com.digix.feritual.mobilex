import { Observable } from 'rxjs/Observable';

import { FoodApiProvider } from '../../providers/food-api/food-api';
import { FoodListComponent } from '../../components/food-list/food-list'
import { LocationSearchResult, FoodLocation, FoodLocationMenu } from '../../providers/food-api/food-api.model';
import { EatstreetApiProvider } from '../../providers/eatstreet-api/eatstreet-api';
import { Restaurant, RestaurantMenuNode } from '../../providers/eatstreet-api/eatstreet-api.model';


export class FoodSearch {
  provider_type_nx = 'nx';
  provider_type_es = 'es';

  public constructor(
    public nxApi : FoodApiProvider,
    public eatstreetApi : EatstreetApiProvider)
  {  }

  public locations : FxLocation[];
  public menus : FxLocationMenu[];
  public isReady = false;

  public initialize = function(lat : number, lng : number) {
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

  async search(query : string) {
    var ctx : FoodSearch = this;
    //return new Promise(function(resolve, reject) {
      var results : FxLocationMenu[] = [];

      for(var loc of ctx.locations) {
        if(loc.type==this.provider_type_es) {
           let menu = await ctx.searchEatStreet(ctx, loc.id);
           console.log(loc.name + ' menu', menu);

           for(var category of menu) {
             for(var item of category.items) {
               if(item.name.indexOf(query)>=0) {
                 console.log('*** found: ' + item.name);
               }
             }
           }


        }
      }

      //resolve(results);
    //});
  }

  searchEatStreet(ctx : FoodSearch, restaurantApiKey : string) : Promise<RestaurantMenuNode> {
    return new Promise(function(resolve, reject) {
      ctx.eatstreetApi.getRestaurantMenu(restaurantApiKey)
        .subscribe(data => {

          resolve(data);

        },
        error =>
        {
          console.log(error);
          reject(error);
        });
    });
  }

  getEatstreetRestaurants = function(ctx : FoodSearch, lat : number, lng : number) {
    return new Promise(function(resolve, reject) {
      ctx.eatstreetApi.getRestaurants(lat, lng)
        .subscribe(data => {
          //console.log('getEatstreetRestaurants.data', data);

          var res : Restaurant[] = data.restaurants;
          var list = ctx.fromEatstreetToNx(res);
          ctx.locations = ctx.locations.concat(list);
          resolve(ctx.locations);
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

  getNxLocations = function(ctx : FoodSearch, lat : number, lng : number) {
    return new Promise(function(resolve, reject) {
      ctx.nxApi.getLocations(lat, lng)
        .subscribe(data => {
          //console.log('getNxLocations.data', data);
          var result : LocationSearchResult = data;
          var list = ctx.fromNxToFx(result.locations);
          ctx.locations = ctx.locations.concat(list);
          resolve(ctx.locations);
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

export interface FxLocationMenu {
  location : FxLocation;
  items : FxLocationMenuItem[];
}

export interface FxLocationMenuItem {
  name : string;
  description : string;
  calories : number;
}
