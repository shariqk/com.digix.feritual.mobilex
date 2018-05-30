import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { FxLocation, FxLocationMenu } from './feritual-api.model';

@Injectable()
export class FeritualApiProvider {
  baseUrl = 'https://comdigixferitualwebapi.azurewebsites.net/api/feritual';
  //baseUrl = 'http://localhost:56893/api/feritual';

  constructor(public http: HttpClient) {
  }

  public getLocationsAsync(lat : number, lng : number, radius : number) : Promise<FxLocation[]> {
    var ctx = this;
    return new Promise(function(resolve, reject) {
      let url : string = ctx.baseUrl + '/locations?lat=' + lat
        + '&lng=' + lng
        + '&radius=' + radius;
      //console.log('getLocationsAsync', url);

      ctx.http.get(url)
        .map(res => <FxLocation[]>res)
        .subscribe(
          locations => {
            resolve(locations)
          },
          error => { console.log('getLocationsAsync', error); reject(error); }
        );
    });
  }


  public getLocationMenuAsync(locationId : string, provider : string) : Promise<FxLocationMenu> {
    var ctx = this;
    return new Promise(function(resolve, reject) {
      //https://comdigixferitualwebapi.azurewebsites.net/api/feritual/menu?id=23909fa74bd804fb144247b91fbcb2f3e04f50a61623f62f&provider=es
      let url : string = ctx.baseUrl + '/menu?id=' + locationId
        + '&provider=' + provider;
      //console.log('getLocationMenuAsync', url);

      ctx.http.get(url)
        .map(res => <FxLocationMenu>res)
        .subscribe(
          menu => {
            //console.log('menu', menu);
            resolve(menu)
          },
          error => { console.log('getLocationMenuAsync', error); reject(error); }
        );
    });
  }

  public searchLocationMenuAsync(fxLocations: FxLocation[], query : string) : Promise<FxLocationMenu[]> {
    var ctx = this;
    return new Promise(function(resolve, reject) {
      let url : string = ctx.baseUrl + '/search';
      //console.log('searchLocationMenuAsync', url);

      var locations = [];
      for(let loc of fxLocations) {
        locations.push({
          id: loc.id,
          provider: loc.type
        })
      }

      var options = {
        query: query,
        locations: locations
      };

      var headers = new HttpHeaders();
      headers = headers.set('Content-Type', 'application/json');
        //.set('Accept', 'application/json');

      //console.log('searchLocationMenuAsync.options', options);

      ctx.http.post(url, JSON.stringify(options))
        .map(res => <FxLocationMenu[]>res)
        .subscribe(
          results => {
            //console.log('results', results);
            resolve(results)
          },
          error => { console.log('searchLocationMenuAsync', error); reject(error); }
        );
    });
  }

}
