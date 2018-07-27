import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Geolocation } from '@ionic-native/geolocation';
import { GoogleApiProvider } from '../../providers/google-api/google-api';

import { UserProfile } from '../userprofile-api/userprofile.model';
import { UserprofileApiProvider } from '../userprofile-api/userprofile-api';
import { FeritualApiProvider } from '../feritual-api/feritual-api';
import { FxIcons } from '../feritual-api/feritual-api.model';
import { Recommendations } from './recommendation-api.model'

@Injectable()
export class RecommendationApiProvider {
  private baseUrl = 'https://comdigixferitualwebapi.azurewebsites.net/api/smart';
  //private baseUrl = 'http://localhost:56893/api/smart';

  constructor(public http: HttpClient,
    private profileApi: UserprofileApiProvider,
    private ferApi: FeritualApiProvider,
    private googleApi: GoogleApiProvider,
    private geo: Geolocation
  ) {
  }



  private getRecommendations(profile : UserProfile, lat : number, lng : number) : Promise<Recommendations> {
    var ctx = this;
    return new Promise(function(resolve, reject) {
      let url : string = ctx.baseUrl + '/recommendations';
      //console.log('getRecommendations', url);

      let options = {
        profile: profile,
        latitude: lat,
        longitude: lng
      };

      ctx.http.post(url, JSON.stringify(options))
        .map(res => <Recommendations>res)
        .subscribe(
          recommendations => {
            resolve(recommendations)
          },
          error => { console.log('getRecommendations', error); reject(error); }
        );
    });
  }

  public async load(lat: number, lng: number) : Promise<Recommendations> {
    if(lat==null || lng==null)
    {
      try {
        let pos = await this.geo.getCurrentPosition({timeout: 20000, enableHighAccuracy: false});
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
      }
      catch(err) {
        // default to time square
        lat = 40.759011;
        lng = -73.984472;
      }
    }

    try {
      let profile = await this.profileApi.loadUserProfile();

      console.log('sending...');
      let recommendationPromise = this.getRecommendations(profile, lat, lng);
      let locPromise = this.googleApi.getLocationFromLatLng(lat, lng);

      await Promise.all([recommendationPromise, locPromise]);
      console.log('completed!!!');

      let r = await recommendationPromise; // await this.getRecommendations(profile, lat, lng);
      r.currentLocation = await locPromise; //await this.googleApi.getLocationFromLatLng(lat, lng);
      r.lat = lat;
      r.lng = lng;

      for(let loc of r.locations) {
        if(loc.logoUrl==null) {
          loc.logoUrl = FxIcons.getIcon(loc.name);
        }
      }

      //r.locations = await this.ferApi.getLocationsAsync(lat, lng, 5);
      console.log('Recommendations', r);
      Recommendations.instance = r;
      return Promise.resolve(r);
    }
    catch(error) {
      console.log('loadRecommendations', error);
      Promise.reject(error);
    }


  }
}
