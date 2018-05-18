
import { FoodApiProvider } from '../../providers/food-api/food-api';
import { FoodListComponent } from '../../components/food-list/food-list'
import { LocationSearchResult, FoodLocation, FoodLocationMenu } from '../../providers/food-api/food-api.model';
import { EatstreetApiProvider } from '../../providers/eatstreet-api/eatstreet-api';
import { Restaurant } from '../../providers/eatstreet-api/eatstreet-api.model';


export class FoodSearch {
  lat = 40.034804;
  lng = -75.301198;

  public constructor(
    public nxApi : FoodApiProvider,
    public eatstreetApi : EatstreetApiProvider)
  {  }

  public locations : FxLocation[];
  public menus : FxLocationMenu[];

  public initialize(lat : number, lng : number, callBackFunction : any) {
    this.locations = [];
  }

  getEatstreetRestaurants(lat : number, lng : number) {
    this.eatstreetApi.getRestaurants(lat, lng)
      .subscribe(data => {
        var res : Restaurant[] = data.restaurants;
        var list = this.fromEatstreetToNx(res);
        this.locations.concat(list);
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

      list.push(fx);
    }

    return list;
  }


  getNxLocations(lat : number, lng : number) {
    this.nxApi.getLocations(lat, lng)
      .subscribe(data => {
        var result : LocationSearchResult = data;
        var locations = this.fromNxToFx(result.locations);
        this.locations.concat(locations);
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
