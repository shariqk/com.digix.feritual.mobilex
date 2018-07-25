import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Geolocation } from '@ionic-native/geolocation';
import { GoogleApiProvider } from '../../providers/google-api/google-api';

import { UserProfile } from '../userprofile-api/userprofile.model';
import { UserprofileApiProvider } from '../userprofile-api/userprofile-api';
import { FeritualApiProvider } from '../feritual-api/feritual-api';
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
      let r = await this.getRecommendations(profile, lat, lng);
      //console.log('Recommendations', r);

      /*
      for(let g of r.items)
      {
        if(g.recipes!=null && g.recipes.length>9) {
          g.recipes.splice(9);
        }
        if(g.menuItems!=null && g.menuItems.length>9) {
          g.menuItems.splice(9);
        }
      }
      */

      r.currentLocation = await this.googleApi.getLocationFromLatLng(lat, lng);
      //r.profile = profile;
      r.lat = lat;
      r.lng = lng;

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
