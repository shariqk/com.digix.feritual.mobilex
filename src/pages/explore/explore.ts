import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, FabContainer, ModalController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { LatLng } from '@ionic-native/google-maps';

import { EatOutMapComponent } from '../../components/eat-out-map/eat-out-map';
import { ProfilePage } from '../../pages/profile/profile';
import { AnalyzePage } from '../../pages/analyze/analyze';
import { AddressPickerPage } from '../../pages/address-picker/address-picker';
import { EatOutVerticalStripComponent } from '../../components/eat-out-vertical-strip/eat-out-vertical-strip';

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
  @ViewChild('eatOutLocations') eatOutLocations: EatOutVerticalStripComponent;

  private locations: FxLocation[];
  private currentLocation: GoogleLocation;
  private refreshingInBackground = false;
  private profile: UserProfile;
  private refreshingCounter: number = 0;
  private maximize_vertical_strip = false;

  private use_current_lat=-9999;
  private use_current_lng=-9999;

  constructor(public navCtrl: NavController,
    private geo: Geolocation,
    private loadingCtrl: LoadingController,
    private googleApi: GoogleApiProvider,
    private alertCtrl: AlertController,
    private ferApi: FeritualApiProvider,
    private profileApi: UserprofileApiProvider,
    private modalCtrl: ModalController,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.initialize();
  }

  async initialize() {
    let ctx = this;

    this.map.Initialize(null, null);
    this.map.markerSelectedCallBack = function(locationId: string) {
      ctx.eatOutLocations.scrollTo(locationId);
      //console.log('selected', locationId);
    };

    this.eatOutLocations.callBackOnScroll = function(locationId: string) {
      ctx.map.SelectLocation(locationId);
    };
    this.eatOutLocations.callBackOnTopClick = function(maximized: boolean) {
      ctx.maximize_vertical_strip = maximized;
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
      this.eatOutLocations.setLocations(this.locations);

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

  async fabActionButtonClicked(fab: FabContainer, action: string) {
    fab.close();
    console.log('action', action, fab);

    switch(action) {
      case 'restaurant':
        this.map.CenterMapTo(this.currentLocation.lat, this.currentLocation.lng);
        break;

      case 'refresh':
        let pos = this.map.GetMapCenter();
        this.refresh(pos.lat, pos.lng);
        break;

      case 'locate':
        this.refresh(null,null);
        break;

      case 'profile':
        this.editUserProfile();
        break;

      case 'analyze':
        this.showAnalyzeDialog(null);
        break;

      default:
        break;
    }
  }

  async addressCardClicked(event : any) {
    let dialog = this.modalCtrl.create(AddressPickerPage,
      {
        address: this.currentLocation.address
      },
      {
        showBackdrop : true
      });

    dialog.onDidDismiss(async loc =>  {
      if(loc != null) {
        this.refresh(loc.lat, loc.lng);
      }
    });

    dialog.present();
  }

  editUserProfile() {
    let dialog = this.modalCtrl.create(ProfilePage,
      {
        profile: this.profile
      },
      {
        showBackdrop : true
      });

    dialog.onDidDismiss(async profile =>  {
      if(profile != null) {
        if(JSON.stringify(this.profile)==JSON.stringify(profile))
        {
          return;
        }

        await this.profileApi.saveUserProfile(profile);
        this.refreshMenusSummary();
        this.profile = profile;
      }
    });

    dialog.present();
  }

  async showAnalyzeDialog(event: any) {
    let dialog = this.modalCtrl.create(AnalyzePage,
      {
        mode: 'dialog'
      },
      {
        showBackdrop : true
      });

    dialog.present();
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
      // default to bryn mawr
      lat = 40.034804; // 40.759011 Time Square;
      lng = -75.301198;// -73.984472 Time Square;
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
