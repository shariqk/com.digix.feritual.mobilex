import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, LoadingController } from 'ionic-angular';
import { GoogleMaps, GoogleMap, CameraPosition, LatLng, GoogleMapsEvent } from '@ionic-native/google-maps';

import { Recommendations } from '../../providers/recommendation-api/recommendation-api.model';
import { AddressPickerPage } from '../../pages/address-picker/address-picker';
//import { FxLocation, FxLocationMenu, FxIcons } from '../../providers/feritual-api/feritual-api.model';
import { PlaceAddress, GoogleLocation } from '../../providers/google-api/google-api.model';
import { RecommendationApiProvider } from '../../providers/recommendation-api/recommendation-api';
import { LocationMenuPage } from '../../pages/location-menu/location-menu';
import { Helper } from '../../providers/feritual-api/feritual-helper';
import { FxLocation, FxLocationMenuItem } from '../../providers/feritual-api/feritual-api.model';

declare var google;

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  markers: any = [];

  currentLocationAddress = 'Loading Near By Locations...';
  currentLocation: GoogleLocation;
  recommendations: Recommendations;

  //directionsService = new google.maps.DirectionsService;
  //directionsDisplay = new google.maps.DirectionsRenderer;

  constructor(public navCtrl: NavController,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private recommendApi: RecommendationApiProvider,
    public navParams: NavParams) {

    Recommendations.onReload('homePage', (val => {
      console.log('recommendations were reloaded');
      this.initialize();
    }));
  }


  ionViewDidLoad() {
    this.initialize();
  }


  async initialize() {
    //let lat = 40.759011;
    //let lng = -73.984472;
    //this.initMap(new LatLng(lat, lng));

    if(Recommendations.instance!=null) {
      //await this.map.one(GoogleMapsEvent.MAP_READY);

      let r = Recommendations.instance;

      this.currentLocationAddress = r.currentLocation.address;
      this.currentLocation = r.currentLocation;
      this.recommendations = r;

      this.initMap(r);

      /*
      await this.map.moveCamera({
        target: new LatLng(r.currentLocation.lat, r.currentLocation.lng),
        zoom: 15,
        tilt: 10,
      });
      */

    }
  }

  async initMap(r: Recommendations) {
    let zoom_level = 12;
    let pos = new LatLng(r.currentLocation.lat, r.currentLocation.lng);

    if(this.map==null)
    {
      this.map = GoogleMaps.create(this.mapElement.nativeElement, {
        zoom: zoom_level,
        tilt: 10,
        center: pos
      });

      //console.log(this.map);
      let m : any = this.map;
      if(m.zoom==null)
      {
        this.map = new google.maps.Map(this.mapElement.nativeElement, {
          zoom: zoom_level,
          tilt: 10,
          center: pos
        });
      }
    }

    if(this.markers!=null)
    {
      for(let m of this.markers)
      {
        m.setMap(null);
      }
    }

    //console.log(this.map);
    this.map.setCenter(pos);

    this.markers = [];
    for(let p of r.locations)
    {
      let pos = new LatLng( p.lat, p.lng);

      let marker = new google.maps.Marker({
        position: pos,
        //animation: google.maps.Animation.DROP,
        map: this.map,
        title: p.name,
        //label: (this.markers.length+1).toString(),
      });
      //marker.zIndex = this.markers.length;
      this.markers.push(marker);

      let infowindow = new google.maps.InfoWindow({
          content: '<b>'+p.name+'</b>'
        });

      marker.addListener('click', function() {
        this.map.setZoom(zoom_level);
        this.map.setCenter(marker.getPosition());
        infowindow.open(marker.get('map'), marker);
      });

    }
  }

  concatStrArray(items : string[]) : string {
    return Helper.concatStrArray(items);
  }

  navigateToLocationMenu(loc: FxLocation) {
    this.navCtrl.push(LocationMenuPage,
      {
        location: loc
      });
  }

  async refresh(lat: number, lng: number) {
    let loading = this.loadingCtrl.create({
       content: 'Please wait...',
     });
    loading.present();

    try {
      await this.recommendApi.load(lat, lng);
      //this.initialize();
    }
    catch(err) {
      console.log(err);
      this.presentAlert('Error', 'An unexpected error occured during refreshing data. Please wait a few minutes and retry.')
    }
    finally {
      loading.dismiss();
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

  formatDistance(distance : number) : string {
    return distance.toFixed(2) + ' mi';
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
