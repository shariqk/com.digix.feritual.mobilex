import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


import { FoodSearchResult, LocationSearchResult, FoodLocationMenu, NuitrientSearchResult } from './food-api.model';

@Injectable()
export class FoodApiProvider {

  baseUrlV1 = "https://api.nutritionix.com/v1_1";
  baseUrlV2 = "https://trackapi.nutritionix.com/v2";
  offset = 0;
  limit = 20;
  distance = '5mi';
  appId = "b0090aa2";
  appKey = "76b86f9d5a5ff688ffa8eaf48df112ac";

  constructor(public http: HttpClient) {
  }

  public testHttp() : Observable<object> {
    var url = 'https://comcricketwebapi.azurewebsites.net/api/messages';
    var result = this.http.get(url)
      .map(res => res);

    return result;
  }

  public getLocations(lat : number, lng : number) : Observable<LocationSearchResult> {
    var url = this.baseUrlV2 + '/locations?limit=' + this.limit
      + '&distance=' + this.distance
      + '&ll=' + lat + ',' + lng;
    //console.log('getLocations', url);

    var result = this.http.get(url, { headers: this.getRequestHeaders() })
      .map(res => <LocationSearchResult>res);

    return result;
  }

  public searchForFood(brand_ids : string[], query : string) : Observable<FoodSearchResult> {
    var url = this.baseUrlV2 + '/search/instant?detailed=1&branded=1&branded_type=1' +
      '&query=' + query;
    for(var b of brand_ids) {
      url += "&brand_ids=" + b;
    }
    console.log('searchForFood', url);

    var result = this.http.get(url, { headers: this.getRequestHeaders() })
      .map(res => <FoodSearchResult>res);

    return result;
  }

  public searchLocationMenu(brand_ids : string[], query : string) : Observable<FoodLocationMenu> {
    var url = this.baseUrlV1 + '/search';
    var queryJson = this.buildLocationMenuSearchJson(brand_ids, query);
    //console.log(url, queryJson);

    var result = this.http.post(url, queryJson, { headers: this.getRequestHeaders() })
      .map(res => <FoodLocationMenu>res);

    return result;
  }

  public getNutrientsAsync(query : string) : Promise<NuitrientSearchResult> {
    var ctx = this;
    return new Promise(function(resolve, reject) {
      ctx.getNutrients(query)
        .subscribe(
          result => {
            resolve(result);
          },
          error => reject(error)
        );
    });
  }

  private getNutrients(query : string) : Observable<NuitrientSearchResult> {
    var url = this.baseUrlV2 + '/natural/nutrients';

    let queryJson = JSON.stringify({
      query : query,
      timezone: "US/Eastern"
    });

    var result = this.http.post(url, queryJson, { headers: this.getRequestHeaders() })
      .map(res => <NuitrientSearchResult>res);

    return result;
  }

  public buildLocationMenuSearchJson(brand_ids : string[], query : string) : string {
    var fields = [
      "item_name",
      "brand_name",
      "nf_calories"
    ];

    var str = '{';
    str += '"appId": "' + this.appId + '",';
    str += '"appKey": "' + this.appKey + '",';
    str += '"offset": "' + this.offset + '",';
    str += '"limit": "' + this.limit + '",';
    str += '"query": "' + query + '",';

    var fieldsString = '';
    for(var f of fields) {
      fieldsString += (fieldsString.length == 0) ? "" : ",";
      fieldsString += '"' + f + '"';
    }
    str += '"fields": [' + fieldsString + '],';

    var filterString = '';
    for(var b of brand_ids) {
      filterString += (filterString.length == 0) ? "" : ",";
      filterString += '"brand_id": "' + b + '"';
    }
    str += '"filters": {' + filterString + "}";

    str += '}';

    return str;
  }

  public getRequestHeaders() : HttpHeaders {
    var headers = new HttpHeaders();
    headers = headers
      .set('x-app-id', this.appId)
      .set('x-app-key',this.appKey)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    return headers;
  }

}
