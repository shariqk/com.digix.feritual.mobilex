
import { FoodApiProvider } from '../../providers/food-api/food-api';
import { FoodListComponent } from '../../components/food-list/food-list'
import { LocationSearchResult, FoodLocation, FoodLocationMenu } from '../../providers/food-api/food-api.model';
import { EatstreetApiProvider } from '../../providers/eatstreet-api/eatstreet-api';
import { Restaurant } from '../../providers/eatstreet-api/eatstreet-api.model';


export class FoodSearch {
  provider_type_nx = 'nx';
  provider_type_es = 'es';

  public constructor(
    public nxApi : FoodApiProvider,
    public eatstreetApi : EatstreetApiProvider)
  {  }

  public locations : FxLocation[];
  public menus : FxLocationMenu[];

  counter = 0;

  public initialize(lat : number, lng : number) {
    this.counter = 0;
    this.locations = [];
    this.getEatstreetRestaurants(lat, lng);
    this.getNxLocations(lat, lng);
  }

  

  getEatstreetRestaurants(lat : number, lng : number) {
    this.eatstreetApi.getRestaurants(lat, lng)
      .subscribe(data => {
        console.log('getEatstreetRestaurants.data', data);

        var res : Restaurant[] = data.restaurants;
        var list = this.fromEatstreetToNx(res);
        this.locations = this.locations.concat(list);
        console.log(this.locations);
        this.counter++;
      },
      error =>
      {
        console.log(error);
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

  public isReady() : boolean {
    return this.counter > 2;
  }

  getNxLocations(lat : number, lng : number) {
    this.nxApi.getLocations(lat, lng)
      .subscribe(data => {
        console.log('getNxLocations.data', data);
        var result : LocationSearchResult = data;
        var list = this.fromNxToFx(result.locations);
        this.locations = this.locations.concat(list);
        console.log(this.locations);
        this.counter++;
      },
      error =>
      {
        console.log(error);
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
