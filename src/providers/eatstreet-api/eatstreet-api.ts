import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { RestaurantSearchResult, RestaurantMenuNode } from './eatstreet-api.model';

@Injectable()
export class EatstreetApiProvider {

  baseUrl = 'https://api.eatstreet.com/publicapi/v1/restaurant';
  //search?latitude=40.034804&longitude=-75.301198&method=both&street-address=316+W.+Washington+Ave.+Madison,+WI';
  apiKey = '__API_EXPLORER_AUTH_KEY__';// '9b094a118dbca429';

  constructor(public http: HttpClient) {
  }

  public getRestaurants(lat : number, lng : number) : Observable<RestaurantSearchResult> {
    var url = this.baseUrl + '/search?method=both'
      + '&latitude=' + lat
      + '&longitude=' + lng;
    console.log('getRestaurants', url);

    var result = this.http.get(url, { headers: this.getRequestHeaders() })
      .map(res => <RestaurantSearchResult>res);

    return result;
  }

  public getRestaurantMenu(restaurantApiKey : string) : Observable<RestaurantMenuNode> {
    var url = this.baseUrl + '/' + restaurantApiKey + '/menu?includeCustomizations=false';
    console.log('getRestaurantMenu', url);

    var result = this.http.get(url, { headers: this.getRequestHeaders() })
      .map(res => <RestaurantMenuNode>res);

    return result;
  }


  public getRequestHeaders() : HttpHeaders {
    var headers = new HttpHeaders();
    headers = headers
      .set('X-Access-Token', this.apiKey)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    return headers;
  }


}
