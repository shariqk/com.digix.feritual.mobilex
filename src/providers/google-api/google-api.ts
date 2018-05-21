import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { PlaceAddress } from './google-api.model';

@Injectable()
export class GoogleApiProvider {

  constructor(public http: HttpClient) {

  }
  apiKey = 'AIzaSyAr4n5frpt323W9RRzxjpEgxhQbDUzVzV0';


  public reverseGeocodeToPlace(lat : number, lng : number) : Observable<PlaceAddress> {
      let url : string = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat+','+lng
        + '&key=' + this.apiKey;
      //console.log('sending', '[' + new Date().toString() + '] ' + url);

      var result = this.http.get(url)
        .map(res => <PlaceAddress>res);

      return result;
    }

}
