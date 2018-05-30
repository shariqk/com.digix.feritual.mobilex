import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { PlaceAddress, LatLngSearchResult, GoogleLocation } from './google-api.model';

@Injectable()
export class GoogleApiProvider {

  constructor(public http: HttpClient) {

  }

  apiKey = 'AIzaSyAr4n5frpt323W9RRzxjpEgxhQbDUzVzV0';
  baseUrl = 'https://maps.googleapis.com/maps/api/geocode';


  public getLocationFromLatLng(lat : number, lng : number) : Promise<GoogleLocation> {
    var ctx = this;
    return new Promise(function(resolve, reject) {
      let url : string = ctx.baseUrl + '/json?latlng=' + lat+','+lng
        + '&key=' + ctx.apiKey;
      //console.log(url);

      var result = ctx.http.get(url)
        .map(res => <PlaceAddress>res)
        .subscribe(
          places => {
            if(places.status.toLowerCase()=='ok' && places.results.length>0) {
              var r = places.results[0];
              let loc = new GoogleLocation();
              loc.address = r.formatted_address;
              loc.lat = lat;
              loc.lng = lng;
              resolve(loc)
            }
            else {
              resolve(null);
            }
          },
          error => { console.log('getLocationFromLatLng', error); reject(error); }
        );
    });
  }


  public getLatLng(address : string) : Observable<LatLngSearchResult> {
    let url : string = this.baseUrl + '/json?address=' + address.replace(' ','+')
      + '&key=' + this.apiKey;
    //console.log('getLatLng', url);

    var result = this.http.get(url)
      .map(res => <LatLngSearchResult>res);

    return result;
  }
  //https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=YOUR_API_KEY

}
