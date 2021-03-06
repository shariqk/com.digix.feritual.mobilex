import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { FxLocation, FxLocationMenu, FxIcons, RecipeSearchResult, FxLocationIdType, FxLocationMenuSummary } from './feritual-api.model';

import { UserProfile } from '../userprofile-api/userprofile.model';

@Injectable()
export class FeritualApiProvider {
  private baseUrl = 'https://comdigixferitualwebapi.azurewebsites.net/api/feritual';
  //baseUrl = 'http://localhost:56893/api/feritual';

  constructor(public http: HttpClient) {
  }

  public getLocationMenusSummaryAsync(profile: UserProfile, locationIdList: FxLocationIdType[]) : Promise<FxLocationMenuSummary[]> {
    var ctx = this;

    return new Promise(function(resolve, reject) {
      let url : string = ctx.baseUrl + '/locationmenusummary';

      let options = {
        profile: profile,
        locationIds: locationIdList
      };

      ctx.http.post(url, JSON.stringify(options))
        .map(res => <FxLocationMenuSummary[]>res)
        .subscribe(
          results => {
            resolve(results)
          },
          error => { console.log('getLocationMenusSummaryAsync', error); reject(error); }
        );
    });
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
            for(let l of locations) {
              if(l.logoUrl==null) {
                l.logoUrl =  FxIcons.getIcon(l.name);
              }
            }
            resolve(locations)
          },
          error => { console.log('getLocationsAsync', error); reject(error); }
        );
    });
  }

  public searchForRecipes(query : string, from : number, to : number) : Promise<RecipeSearchResult> {
    //https://comdigixferitualwebapi.azurewebsites.net/api/feritual/searchrecipe?query=chicken
    var ctx = this;
    return new Promise(function(resolve, reject) {
      let url : string = ctx.baseUrl + '/searchrecipe?query=' + query
        + '&from=' + from
        + '&to=' + to;
      //console.log('getLocationsAsync', url);

      ctx.http.get(url)
        .map(res => <RecipeSearchResult>res)
        .subscribe(
          locations => {
            resolve(locations)
          },
          error => { console.log('searchForRecipes', error); reject(error); }
        );
    });
  }

  public getLocationMenuAsync(locationId : string, provider : string, refresh : boolean, profile : UserProfile) : Promise<FxLocationMenu> {
    var ctx = this;
    return new Promise(function(resolve, reject) {
      //https://comdigixferitualwebapi.azurewebsites.net/api/feritual/menu?id=23909fa74bd804fb144247b91fbcb2f3e04f50a61623f62f&provider=es
      let url : string = ctx.baseUrl + '/locationmenu?id=' + locationId
        + '&provider=' + provider;
      if(refresh) {
        url += '&refresh=1';
      }

      console.log('getLocationMenuAsync', url);

      ctx.http.post(url, JSON.stringify(profile))
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

  public searchLocationMenuAsync(fxLocations: FxLocation[], query : string, profile : UserProfile) : Promise<FxLocationMenu[]> {
    var ctx = this;
    return new Promise(function(resolve, reject) {
      let url : string = ctx.baseUrl + '/search';
      //console.log('searchLocationMenuAsync', url);

      var locations = [];
      for(let loc of fxLocations) {
        locations.push({
          id: loc.id,
          provider: loc.provider
        })
      }

      var options = {
        query: query,
        locations: locations,
        profile : profile
      };

      var headers = new HttpHeaders();
      headers = headers.set('Content-Type', 'application/json');

      ctx.http.post(url, JSON.stringify(options))
        .map(res => <FxLocationMenu[]>res)
        .subscribe(
          results => {
            resolve(results)
          },
          error => { console.log('searchLocationMenuAsync', error); reject(error); }
        );
    });
  }

}
