import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Geolocation } from '@ionic-native/geolocation';

import { UserProfile } from '../userprofile-api/userprofile.model';
import { UserprofileApiProvider } from '../userprofile-api/userprofile-api';
import { FeritualApiProvider } from '../feritual-api/feritual-api';
import { Recommendations } from './recommendation-api.model'

@Injectable()
export class RecommendationApiProvider {
  //private baseUrl = 'https://comdigixferitualwebapi.azurewebsites.net/api/smart';
  private baseUrl = 'http://localhost:56893/api/smart';

  constructor(public http: HttpClient,
    private profileApi: UserprofileApiProvider,
    private ferApi: FeritualApiProvider,
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


  public async loadRecommendations() : Promise<Recommendations> {
    if(Recommendations.instance!=null) {
      return Promise.resolve(Recommendations.instance);
    }

    let lat = null;
    let lng = null;

    try {
      let pos = await this.geo.getCurrentPosition({timeout: 20000, enableHighAccuracy: false});
      lat = pos.coords.latitude;
      lng = pos.coords.longitude;
    }
    catch(err) {
      //ignore since we may not have the ability to get location
    }

    try {
      let profile = await this.profileApi.loadUserProfile();
      let r = await this.getRecommendations(profile, lat, lng);
      //console.log('Recommendations', r);

      for(let g of r.items)
      {
        if(g.recipes!=null && g.recipes.length>9) {
          g.recipes.splice(9);
        }
      }

      Recommendations.instance = r;
      return Promise.resolve(r);
    }
    catch(error) {
      console.log('loadRecommendations', error);
      Promise.reject(error);
    }


  }
}
