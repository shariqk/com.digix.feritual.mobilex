import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { RestaurantSearchResult, RestaurantMenuNode } from './eatstreet-api.model';

@Injectable()
export class EatstreetApiProvider {

  baseUrl = 'https://comdigixferitualwebapi.azurewebsites.net/api/eatstreet';

  constructor(public http: HttpClient) {
  }

  public getRestaurants(lat : number, lng : number) : Observable<RestaurantSearchResult> {
    var url = this.baseUrl + '/restaurants?'
      + '&lat=' + lat
      + '&lng=' + lng;
    //console.log('getRestaurants', url);

    var result = this.http.get(url)
      .map(res => <RestaurantSearchResult>res);

    return result;
  }

  public getRestaurantMenu(restaurantApiKey : string) : Observable<RestaurantMenuNode[]> {
    var url = this.baseUrl + '/menu?apiKey=' + restaurantApiKey;
    //console.log('getRestaurantMenu', url);

    var result = this.http.get(url)
      .map(res => <RestaurantMenuNode[]>res);

    return result;
  }

  public getRestaurantMenuAsync(restaurantApiKey : string) : Promise<RestaurantMenuNode[]> {
    var ctx = this;
    return new Promise(function(resolve, reject) {
      ctx.getRestaurantMenu(restaurantApiKey)
        .subscribe(
          result => {
            resolve(result);
          },
          error => reject(error)
        );
    });
  }

}
