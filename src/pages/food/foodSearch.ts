import { Observable } from 'rxjs/Observable';

import { FoodApiProvider } from '../../providers/food-api/food-api';
import { FoodListComponent } from '../../components/food-list/food-list'
import { LocationSearchResult, FoodLocation, FoodLocationMenu, FoodSearchResult } from '../../providers/food-api/food-api.model';
import { EatstreetApiProvider } from '../../providers/eatstreet-api/eatstreet-api';
import { Restaurant, RestaurantMenuNode } from '../../providers/eatstreet-api/eatstreet-api.model';
import { FxLocation, FxLocationMenu, FxLocationMenuItem, FxLocationType, FxIcons } from '../../providers/models/fxlocation';

export class FoodSearch {
  results : FxLocationMenu[];

  public constructor(
    public nxApi : FoodApiProvider,
    public eatstreetApi : EatstreetApiProvider)
  {  }



  public getLocationsAsync = async function(lat : number, lng : number) : Promise<FxLocation[]> {
    try {
      var locations : FxLocation[] = [];
      let esLocations = await this.getEatstreetRestaurants(this, lat, lng);
      locations = locations.concat(esLocations);

      let nxLocations = await this.getNxLocations(this, lat, lng);
      locations = locations.concat(nxLocations);

      var obj = new DistanceCalculator();
      obj.calculateDistance(lat, lng, locations);
      obj.sortByDistance(locations);

      return locations;

    } catch (err) {
      alert(JSON.stringify(err));
      console.log(err);
    }
  }

  public getLocations = function(lat : number, lng : number) : Promise<FxLocation[]> {
    let ctx = this;
    return new Promise(function(resolve, reject) {
      var locations : FxLocation[] = [];

      ctx.getNxLocations(ctx, lat, lng)
        .then(nxLocations => {
          locations = locations.concat(nxLocations);
          var obj = new DistanceCalculator();
          obj.calculateDistance(lat, lng, locations);
          locations = obj.sortByDistance(locations);
          resolve(locations);
        }).catch(err => {
          console.log(err);
          reject(err);
        })
      });
    }


  public search = async function(locations: FxLocation[], query : string) : Promise<FxLocationMenu[]> {
    var ctx : FoodSearch = this;
    var results : FxLocationMenu[] = [];
    //console.log('locations-to-process', locations);
    let processedList : string[] = [];

    for(var loc of locations) {
      if(processedList.indexOf(loc.name)>=0) {
        //console.log('skipping ', loc);
        continue;
      }
      var menu : FxLocationMenu = null;
      if(loc.type==FxLocationType.provider_type_es) {
         menu = await ctx.searchEatstreetMenu(ctx, loc, query);
         //console.log('menu', menu);
      }
      else if(loc.type==FxLocationType.provider_type_nx) {
          menu = await this.searchNxLocationMenu(ctx, loc, query);
      }

      if(menu!=null && menu.items.length>0)
      {
        results.push(menu);
      }

      processedList.push(loc.name);
    }

    return results;
  }





  getEatStreetRestaurantMenu = function(ctx : FoodSearch, restaurantApiKey : string) : Promise<RestaurantMenuNode[]> {
    return new Promise(function(resolve, reject) {
      ctx.eatstreetApi.getRestaurantMenu(restaurantApiKey)
        .subscribe(data => {
          //console.log(restaurantApiKey, data);
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
      fx.type = FxLocationType.provider_type_es;
      fx.logoUrl = res.logoUrl;

      list.push(fx);
    }

    return list;
  }


  async searchEatstreetMenu(ctx : FoodSearch, loc: FxLocation, query : string) : Promise<FxLocationMenu> {
    let menu = await ctx.getEatStreetRestaurantMenu(ctx, loc.id);
    //console.log(loc.name + ' menu', menu);

    let m = new FxLocationMenu();
    m.location = loc;
    m.items = [];
    query = query.toLowerCase();

    for(var category of menu) {
      for(var item of category.items) {
        let str = (item.name + ' ' + item.description).toLowerCase();
        if(str.indexOf(query)>=0) {
          let i = new FxLocationMenuItem();
          i.calories = -1; // estimated
          i.name = item.name;
          i.description = item.description;
          i.photoUrl = FxIcons.generic_icon_url;

          //console.log('item', i);

          m.items.push(i);
        }
      }
    }

    return m;
  }

  searchNxRestaurantMenu = function(ctx : FoodSearch, brand_id : string, query : string) : Promise<FoodLocationMenu> {
    return new Promise(function(resolve, reject) {
      ctx.nxApi.searchLocationMenu([brand_id], query)
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

  async searchNxLocationMenu(ctx : FoodSearch, loc: FxLocation, query : string) : Promise<FxLocationMenu> {
    let menu = await ctx.searchNxRestaurantMenu(ctx, loc.id, query);
    let m = new FxLocationMenu();
    m.location = loc;
    m.items = [];

    for(var item of menu.hits) {
      let i = new FxLocationMenuItem();
      //console.log('processing: ' + i);
      i.calories = item.fields.nf_calories;
      i.name = item.fields.item_name;
      i.description = item.fields.item_description;
      i.photoUrl = FxIcons.generic_icon_url;

      m.items.push(i);
    }

    //console.log('resolving to m: ' + m);
    return m;
  }

  getNxLocations = function(ctx : FoodSearch, lat : number, lng : number) : Promise<FxLocation[]> {
    return new Promise(function(resolve, reject) {
      ctx.nxApi.getLocations(lat, lng)
        .subscribe(data => {
          console.log('getNxLocations.data', data);
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
        fx.type = FxLocationType.provider_type_nx;
        fx.logoUrl = FxIcons.getIcon(fx.name); // 'https://www.shareicon.net/data/256x256/2017/06/21/887479_heart_512x512.png';
        //fx.description = loc.guide;

        list.push(fx);
      }

      return list;
  }




}

export class DistanceCalculator
{

  public calculateDistance(lat : number, lng : number, locations : FxLocation[]) : void {
    for(var loc of locations) {
      loc.distance = this.haversine(loc.lat, loc.lng, lat, lng);
    }
  }

  public sortByDistance(locations : FxLocation[]) : FxLocation[] {
    return locations.sort(function(a, b) {
      if (a.distance == b.distance)
       {
           return 0;
       }
       else if (a.distance > b.distance)
       {
           return 1;
       }
       else
       {
           return -1;
       }
    });

  }

  haversine = function(startLng : number, startLat : number, endLng : number, endLat : number) : number {
    let R : number = 3960; // this.radii.mile;

    let dLat = this.toRad(endLat - startLat);
    let dLon = this.toRad(endLng - startLng);
    let lat1 = this.toRad(startLat);
    let lat2 = this.toRad(endLat);

    let a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  radii = {
    km:    6371,
    mile:  3960,
    meter: 6371000,
    nmi:   3440
  }

  toRad = function(num : number) : number {
      return num * Math.PI / 180
  }


}
