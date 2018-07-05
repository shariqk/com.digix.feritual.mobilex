import { Component , ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, ModalController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

//import { FoodApiProvider } from '../../providers/food-api/food-api';
import { FoodListComponent } from '../../components/food-list/food-list'
//import { LocationSearchResult, FoodLocation, FoodLocationMenu } from '../../providers/food-api/food-api.model';
//import { EatstreetApiProvider } from '../../providers/eatstreet-api/eatstreet-api';
//import { Restaurant } from '../../providers/eatstreet-api/eatstreet-api.model';
//import { FoodSearch } from './foodSearch';
//import { FxLocation, FxLocationMenu } from '../../providers/models/fxlocation';
import { LocationMenuPage } from '../../pages/location-menu/location-menu';
import { ProfilePage } from '../../pages/profile/profile';

import { FeritualApiProvider } from '../../providers/feritual-api/feritual-api';
import { FxLocation, FxLocationMenu, FxIcons } from '../../providers/feritual-api/feritual-api.model';
import { DistanceCalculator } from '../../providers/feritual-api/feritual-helper';
import { UserProfile, UserProfileHelper } from '../../providers/userprofile-api/userprofile.model';
import { UserprofileApiProvider } from '../../providers/userprofile-api/userprofile-api';
import { Recommendations } from '../../providers/recommendation-api/recommendation-api.model';
import { RecommendationApiProvider } from '../../providers/recommendation-api/recommendation-api';

import { GoogleApiProvider } from '../../providers/google-api/google-api';
import { PlaceAddress, GoogleLocation } from '../../providers/google-api/google-api.model';
import { AddressPickerPage } from '../../pages/address-picker/address-picker';
import { Helper, MenuHelper } from '../../providers/feritual-api/feritual-helper';


@IonicPage()
@Component({
  selector: 'page-food',
  templateUrl: 'food.html',
})
export class FoodPage {
  //nearme : LocationSearchResult;
  searchTerm : string;
  results : FxLocationMenu[];
  placeholderText = 'name of food or cuisine (say Thai or Burger)';
  currentLocation : GoogleLocation;
  locations : FxLocation[];
  radius = 5;
  profile : UserProfile;
  recommendations : Recommendations;

  constructor(public navCtrl: NavController,
    public modalCtrl : ModalController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private profileApi : UserprofileApiProvider,
    private geolocation: Geolocation,
    private recommendApi: RecommendationApiProvider,
    private googleApi : GoogleApiProvider,
    private ferApi : FeritualApiProvider) {

      this.getRecommendations();
      this.initialize();
  }

  async initialize() {
    this.currentLocation = new GoogleLocation();
    this.currentLocation.address = 'Tap here to get started';
    this.profile = await this.profileApi.loadUserProfile();
  }

  ionViewDidLoad() {
  }

  async getRecommendations() {
    let r = await this.recommendApi.loadRecommendations();
    this.recommendations = r;
    //console.log('recommendations', r);
  }

  searchCleared() {
    this.results = null;
  }

  formatDistance(distance : number) : string {
    return distance.toFixed(2) + ' mi';
  }

  navigateToLocationMenu(loc : FxLocation)
  {
    this.navCtrl.push(LocationMenuPage,
      {
        location : loc,
        profile : this.profile
      });
  }

  concatStrArray(items : string[]) : string {
    return Helper.concatStrArray(items);
  }

  async getLocations(loc : GoogleLocation)
  {
    let toast = this.toastCtrl.create({
        message: 'Please wait...',
        position: 'top'
      });
    toast.present();

    try {
      //let search = new FoodSearch(this.api, this.eatstreetApi);
      //let locations = await search.getLocationsAsync(loc.lat, loc.lng);

      let locations = await this.ferApi.getLocationsAsync(loc.lat, loc.lng, this.radius);
      //console.log(this.locations);

      //var obj = new DistanceCalculator();
      //obj.calculateDistance(loc.lat, loc.lng, locations);
      //obj.sortByDistance(locations);

      for(var l of locations) {
        if(l.logoUrl==null) {
          l.logoUrl =  FxIcons.getIcon(l.name); // 'https://www.shareicon.net/data/256x256/2017/06/21/887479_heart_512x512.png';
        }
      }

      this.currentLocation = loc;
      this.locations = locations;
      this.placeholderText = 'Search in ' + this.locations.length + ' places (e.g., Sushi or Burger)';
      //console.log(this.locations);
    }
    catch(err) {
      alert('error in getting locations: ' + JSON.stringify(err));
    }
    finally {
      toast.dismiss();
    }

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
        await this.profileApi.saveUserProfile(profile);
        this.profile = profile;
      }
    });

    dialog.present();
  }

  addressCardClicked(event : any) {
    let dialog = this.modalCtrl.create(AddressPickerPage,
      {
        address: this.currentLocation.address
      },
      {
        showBackdrop : true
      });

    dialog.onDidDismiss(async loc =>  {
      if(loc != null) {
        await this.getLocations(loc);
        this.searchTerm = null;
        this.results = null;
      }
    });

    dialog.present();
  }


  getLocationFromId(locations : FxLocation[], id : string) : FxLocation {
    for(var loc of locations)
    {
      if(loc.id==id) {
        return loc;
      }
    }
    return null;
  }

  async doLocationMenuSearch(event : any) {
    if(this.searchTerm==null || this.searchTerm.length<4) {
        return;
    }

    let loading = this.loadingCtrl.create({
       content: 'Searching...',
     });
    loading.present();


    try {
      let results =  await this.ferApi.searchLocationMenuAsync(this.locations, this.searchTerm, this.profile);
      this.saveSearchTerm(this.searchTerm);

      for(var menu of results) {
        var loc = this.getLocationFromId(this.locations, menu.locationId);
        menu.location = loc;
        MenuHelper.fixMenuPhotoUrl(menu);
      }

      this.results = results;
    }
    catch(err) {
      alert('error in getting locations: ' + JSON.stringify(err));
    }
    finally {
      loading.dismiss();
    }

  }

  async saveSearchTerm(searchTerm : string) {
    if(UserProfileHelper.addFoodSearch(this.profile, searchTerm))
    {
      await this.profileApi.saveUserProfile(this.profile);
    }
  }

}
