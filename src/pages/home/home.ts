import { Component, ViewChild, ElementRef } from '@angular/core';
import { Content, IonicPage, NavController, NavParams, ModalController, AlertController, LoadingController, ToastController, FabContainer, Scroll } from 'ionic-angular';
import { GoogleMaps, GoogleMap, CameraPosition, LatLng, GoogleMapsEvent } from '@ionic-native/google-maps';

//import { Recommendations } from '../../providers/recommendation-api/recommendation-api.model';
import { AddressPickerPage } from '../../pages/address-picker/address-picker';
//import { FxLocation, FxLocationMenu, FxIcons } from '../../providers/feritual-api/feritual-api.model';
import { PlaceAddress, GoogleLocation } from '../../providers/google-api/google-api.model';
//import { RecommendationApiProvider } from '../../providers/recommendation-api/recommendation-api';
import { LocationMenuPage } from '../../pages/location-menu/location-menu';
import { Helper } from '../../providers/feritual-api/feritual-helper';
import { FxLocation, FxLocationMenuItem, FxLocationIdType, FxLocationMenuSummary } from '../../providers/feritual-api/feritual-api.model';
import { Geolocation } from '@ionic-native/geolocation';
import { UserProfile, UserProfileHelper, FoodFilters, FoodFilterItem } from '../../providers/userprofile-api/userprofile.model';
import { UserprofileApiProvider } from '../../providers/userprofile-api/userprofile-api';
import { FeritualApiProvider } from '../../providers/feritual-api/feritual-api';
import { GoogleApiProvider } from '../../providers/google-api/google-api';
import { ProfilePage } from '../../pages/profile/profile';

declare var google;

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('filmStrip') filmStrip: any;
  @ViewChild(Content) content: Content;
  filmScrollContent: ElementRef;

  map: any;
  markers: any = [];
  profile: UserProfile;
  currentLocation: GoogleLocation;
  locations: FxLocation[];
  //recommendations: Recommendations;

  //directionsService = new google.maps.DirectionsService;
  //directionsDisplay = new google.maps.DirectionsRenderer;

  constructor(public navCtrl: NavController,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private geo: Geolocation,
    private profileApi: UserprofileApiProvider,
    private googleApi: GoogleApiProvider,
    private toastCtrl: ToastController,
    private ferApi: FeritualApiProvider,
    //private recommendApi: RecommendationApiProvider,
    public navParams: NavParams) {


      //Recommendations.onReload('homePage', (val => {
      //  console.log('recommendations were reloaded');
      //  this.initialize();
      //}));

  }

  private film_scrolling = false;
  private zoom_level = 11;
  private street_zoom_level = 15;
  private default_marker_pin = this.pinSymbol("#f4f4f4");
  private highlight_marker_pin = null;// this.pinSymbol("#488aff");
  private highlightedMarker = null;
  private using_map_plugIn = true;

  ionViewDidLoad() {
    this.initialize();

  }

  async initialize() {
    this.createMap(null,null);
    this.profile = await this.profileApi.loadUserProfile();
    this.filmScrollContent =  this.filmStrip._scrollContent;

    this.filmStrip.addScrollEventListener(($event: any) => {
      //console.log('$event', event);
      if(!this.film_scrolling) {
        window.setTimeout(() => {
          this.autoSelectMapMarker();
          this.film_scrolling = false;
        }, 1000);
        this.film_scrolling = true;
      }
    });

    this.refresh(null, null);
  }

  async setDefaultMarkerIcon(selectedLocId: string) {
    if(selectedLocId!=null) {
      for(let m of this.markers) {
        if(m.locationId!=selectedLocId) {
          m.setIcon(this.default_marker_pin);
        }
      }
    }
  }

  async autoSelectMapMarker() {
    let p = this.filmScrollContent.nativeElement as HTMLElement;
    let offset = p.scrollLeft;
    let locId = null;

    for(let m of this.markers) {
      let e = document.getElementById(m.locationId).parentElement;
      if(e.offsetLeft+(e.clientWidth/2)>p.scrollLeft)
      {
        if(this.highlightedMarker==m) {
          break;
        }
        if(this.highlightedMarker!=null) {
          this.highlightedMarker.setIcon(this.default_marker_pin);
          this.highlightedMarker.zIndex = google.maps.Marker.MAX_ZINDEX + 1;
        }
        locId = m.locationId;
        m.setIcon(this.highlight_marker_pin);
        //m.map.setZoom(this.street_zoom_level);
        m.map.panTo(m.getPosition());
        m.zIndex = google.maps.Marker.MAX_ZINDEX + 2;


        this.highlightedMarker = m;
        //console.log('marker', m.title);
        break;
      }
    }

    this.setDefaultMarkerIcon(locId);
  }

  async setFoodFilter(filter: FoodFilterItem) {
    filter.selected = !filter.selected;
    await this.profileApi.saveUserProfile(this.profile);
    this.refreshMenusSummary();
  }

  /*
  async initialize() {

    if(Recommendations.instance!=null) {
      let r = Recommendations.instance;

      this.currentLocationAddress = r.currentLocation.address;
      this.currentLocation = r.currentLocation;
      this.recommendations = r;

      //console.log('profile',this.profile);


      this.buildMapMarkers(r);
      let p = this.filmScrollContent.nativeElement as HTMLElement;
      p.scrollTo(0,0);
    }
  }
  */

  async createMap(lat: number, lng: number) {
    // default to time square

    if(this.map==null)
    {
      if(lat==null || lng==null)
      {
        lat = 40.759011;
        lng = -73.984472;
      }

      let pos = new LatLng(lat, lng);
      let options = {
        zoom: this.zoom_level,
        tilt: 10,
        center: pos,
        fullscreenControl: false
      };

      this.map = GoogleMaps.create(this.mapElement.nativeElement, options);

      //console.log(this.map);
      let m : any = this.map;
      if(m.zoom==null)
      {
        this.map = new google.maps.Map(this.mapElement.nativeElement, options);
        this.using_map_plugIn = false;
      }

      //this.getCurrentPosition().then(pos => {
      //  this.map.panTo(pos);
      //});
    }
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
    console.log('position', pos);
    return Promise.resolve(pos);
  }

  async buildMapMarkers(pos: LatLng) {
    //let pos = new LatLng(this.currentLocation.lat, this.currentLocation.lng);

    if(this.markers!=null)
    {
      for(let m of this.markers)
      {
        m.setMap(null);
      }
    }

    //console.log(this.map);
    this.highlightedMarker = null;
    this.map.panTo(pos);
    let ctx = this;
    this.markers = [];
    for(let p of this.locations)
    {
      let pos = new LatLng(p.lat, p.lng);

      let marker = new google.maps.Marker({
        position: pos,
        //animation: google.maps.Animation.DROP,
        map: this.map,
        icon: this.default_marker_pin, // 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
        title: p.name,
        zIndex: google.maps.Marker.MAX_ZINDEX + 1,
        locationId: p.id,
        //label: (this.markers.length+1).toString(),
      });

      //marker.zIndex = this.markers.length;
      this.markers.push(marker);

      let infowindow = new google.maps.InfoWindow({
          content: '<b>'+p.name+'</b>'
        });

      marker.addListener('click', function() {
        //alert('hello');
        //this.map.setZoom(this.street_zoom_level);
        this.map.panTo(marker.getPosition());
        marker.setIcon(this.highlight_marker_pin);
        ctx.setDefaultMarkerIcon(marker.locationId);

        //
        //console.log('clicked', p.name);
        //this.filmStrip.scrollElement.scrollTo(0, 500);
        ctx.scrollTo(p.id);

        //infowindow.open(marker.get('map'), marker);
        //window.setTimeout(() => {
        //  infowindow.close();
        //}, 5000);
      });

    }

    let p = this.filmScrollContent.nativeElement as HTMLElement;
    if(p!=null) {
      p.scrollTo(0,0);
    }
  }

  async scrollTo(elementId: string) {
    let e = document.getElementById(elementId).parentElement;
    if(e!=null) {
      e.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
    }
  }

  async fabActionButtonClicked(fab: FabContainer, action: string) {
    fab.close();
    console.log('action', action, fab);

    switch(action) {
      case 'restaurant':
        this.map.setZoom(this.zoom_level);
        let ctr = new LatLng(this.currentLocation.lat, this.currentLocation.lng);
        this.map.setCenter(ctr);
        this.map.panTo(ctr);
        break;

      case 'refresh':
        let pos = null;
        if(this.using_map_plugIn) {
          pos = this.map.getCenter();
        }
        else {
          pos = this.map.getBounds().getCenter();
        }
        console.log('center', pos);
        this.refresh(pos.lat(), pos.lng());
        break;

      case 'locate':
        this.refresh(null,null);
        break;

      case 'profile':
        this.editUserProfile();
        break;

      default:
        break;
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

  private use_current_lat=-9999;
  private use_current_lng=-9999;

  async refreshMenusSummary() {
    var locationIdList: FxLocationIdType[] = [];
    for(var loc of this.locations) {
      locationIdList.push({
        id: loc.id,
        provider: loc.provider
      });
    }

    this.ferApi.getLocationMenusSummaryAsync(this.profile, locationIdList).then(results => {
      console.log('getLocationMenusSummaryAsync', results)
      for(let r of results) {
        for(let loc of this.locations) {
          if(loc.id==r.locationId.id) {
            loc.menuSummary = r;
            //break;
          }
        }
      }
    },
    (err => {
      console.log('refreshMenusSummary', err);
      this.presentAlert('Error', 'An unexpected error occured during refreshing menu summary data. Please wait a few minutes and retry.')
    }));
  }

  async refresh(lat: number, lng: number) {
    let loading = this.loadingCtrl.create({
       content: 'Please wait...',
     });
    loading.present();

    try {
      if(lat==null || lng==null)
      {
        let pos = await this.getCurrentPosition();
        lat = pos.lat;
        lng = pos.lng;
      }
      else if(this.currentLocation!=null && lat==this.use_current_lat && lng==this.use_current_lng) {
        lat = this.currentLocation.lat;
        lng = this.currentLocation.lng;
      }
      this.locations = null;

      this.map.setZoom(this.zoom_level);
      this.map.panTo(new LatLng(lat, lng));
      this.map.setCenter(new LatLng(lat, lng));

      this.googleApi.getLocationFromLatLng(lat, lng).then(result => {
        this.currentLocation = result;
      },
      (err => {
        console.log('getLocationFromLatLng', err);
        this.presentAlert('Error', 'An unexpected error occured during fetching location details. Please wait a few minutes and retry.')
      }));

      this.locations = await this.ferApi.getLocationsAsync(lat, lng, 5);
      this.buildMapMarkers(new LatLng(lat, lng));

      // refersh the menu summary for the locations
      this.refreshMenusSummary();
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

  pinSymbol(color: string) {
    return {
        path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0',
        fillColor: color,
        fillOpacity: 1,
        strokeColor: '#000',
        strokeWeight: 2,
        scale: 1,
   };
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

  presentAlert(title: string, text: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }
}
