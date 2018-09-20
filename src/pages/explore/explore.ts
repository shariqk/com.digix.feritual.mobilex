import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { LatLng } from '@ionic-native/google-maps';

import { EatOutMapComponent } from '../../components/eat-out-map/eat-out-map';
import { FxLocation, FxLocationIdType } from '../../providers/feritual-api/feritual-api.model';
import { GoogleApiProvider } from '../../providers/google-api/google-api';
import { GoogleLocation } from '../../providers/google-api/google-api.model';
import { FeritualApiProvider } from '../../providers/feritual-api/feritual-api';
import { UserProfile } from '../../providers/userprofile-api/userprofile.model';
import { UserprofileApiProvider } from '../../providers/userprofile-api/userprofile-api';


@IonicPage()
@Component({
  selector: 'page-explore',
  templateUrl: 'explore.html',
})
export class ExplorePage {
  @ViewChild('map') map: EatOutMapComponent;
  private locations: FxLocation[];
  private currentLocation: GoogleLocation;
  private refreshingInBackground = false;
  private profile: UserProfile;
  private refreshingCounter: number = 0;


  private use_current_lat=-9999;
  private use_current_lng=-9999;

  constructor(public navCtrl: NavController,
    private geo: Geolocation,
    private loadingCtrl: LoadingController,
    private googleApi: GoogleApiProvider,
    private alertCtrl: AlertController,
    private ferApi: FeritualApiProvider,
    private profileApi: UserprofileApiProvider,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.initialize();
  }

  async initialize() {
    this.map.Initialize(null, null);
    this.map.markerSelectedCallBack = function(locationId: string) {
      console.log('selected', locationId);
    };

    this.profile = await this.profileApi.loadUserProfile();

    this.refresh(null, null);
  }


  async refresh(lat: number, lng: number) {
    this.refreshingCounter++;

    try {
      if(lat==null || lng==null) {
        let pos = await this.getCurrentPosition();
        lat = pos.lat;
        lng = pos.lng;
      }
      else if(this.currentLocation!=null && lat==this.use_current_lat && lng==this.use_current_lng) {
        lat = this.currentLocation.lat;
        lng = this.currentLocation.lng;
      }
      this.locations = null;

      this.map.CenterMapTo(lat, lng);


      this.googleApi.getLocationFromLatLng(lat, lng).then(result => {
        this.currentLocation = result;
      },
      (err => {
        console.log('getLocationFromLatLng', err);
        this.presentAlert('Error', 'An unexpected error occured during fetching location details. Please wait a few minutes and retry.')
      }));

      this.locations = await this.ferApi.getLocationsAsync(lat, lng, 5);
      this.map.MarkLocations(this.locations);

      // refersh the menu summary for the locations
      this.refreshMenusSummary();
    }
    catch(err) {
      console.log(err);
      this.presentAlert('Error', 'An unexpected error occured during refreshing data. Please wait a few minutes and retry.')
    }
    finally {
      this.refreshingCounter--;

    }
  }

  async refreshMenusSummary() {
    var locationIdList: FxLocationIdType[] = [];
    for(var loc of this.locations) {
      locationIdList.push({
        id: loc.id,
        provider: loc.provider
      });
    }

    this.refreshingCounter++;
    this.ferApi.getLocationMenusSummaryAsync(this.profile, locationIdList).then(results => {
      //console.log('getLocationMenusSummaryAsync', results)
      for(let r of results) {
        for(let loc of this.locations) {
          if(loc.id==r.locationId.id) {
            loc.menuSummary = r;
            //break;
          }
        }
      }
      this.refreshingCounter--;
    },
    (err => {
      console.log('refreshMenusSummary', err);
      this.refreshingCounter--;
      this.presentAlert('Error', 'An unexpected error occured during refreshing menu summary data. Please wait a few minutes and retry.')
    }));
  }

  async getCurrentPosition(): Promise<LatLng> {
    let lat = 0;
    let lng = 0;

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

    let pos = new LatLng(lat, lng);
    //console.log('position', pos);
    return Promise.resolve(pos);
  }

  presentAlert(title: string, text: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }
}
