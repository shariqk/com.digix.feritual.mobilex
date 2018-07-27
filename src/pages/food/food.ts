import { Component , ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, ModalController, AlertController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Storage } from '@ionic/storage';

//import { FoodApiProvider } from '../../providers/food-api/food-api';
//import { FoodListComponent } from '../../components/food-list/food-list'
//import { LocationSearchResult, FoodLocation, FoodLocationMenu } from '../../providers/food-api/food-api.model';
//import { EatstreetApiProvider } from '../../providers/eatstreet-api/eatstreet-api';
//import { Restaurant } from '../../providers/eatstreet-api/eatstreet-api.model';
//import { FoodSearch } from './foodSearch';
//import { FxLocation, FxLocationMenu } from '../../providers/models/fxlocation';
import { LocationMenuPage } from '../../pages/location-menu/location-menu';
import { ProfilePage } from '../../pages/profile/profile';
import { IntroPage } from '../../pages/intro/intro';
import { FeritualApiProvider } from '../../providers/feritual-api/feritual-api';
import { FxLocation, FxLocationMenu, FxIcons } from '../../providers/feritual-api/feritual-api.model';
import { DistanceCalculator } from '../../providers/feritual-api/feritual-helper';
import { UserProfile, UserProfileHelper, FoodFilters, FoodFilterItem } from '../../providers/userprofile-api/userprofile.model';
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
  view : string = 'food';
  initialized: boolean = false;
  //foodFilters: FoodFilters;

  constructor(public navCtrl: NavController,
    public modalCtrl : ModalController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private profileApi : UserprofileApiProvider,
    private geolocation: Geolocation,
    private storage: Storage,
    private recommendApi: RecommendationApiProvider,
    private googleApi : GoogleApiProvider,
    private ferApi : FeritualApiProvider) {
      //this.getRecommendations();
      if(Recommendations.instance!=null) {
        this.initialize();
      }
      else {
        this.recommendApi.load(null,null);
        this.currentLocation = new GoogleLocation();
        this.currentLocation.address = "Click here to get started";
      }

      Recommendations.onReload('food', (val => {
        console.log('recommendations were reloaded');
        this.initialize();
      }));
  }


  async initialize() {
    this.recommendations = Recommendations.instance;
    this.currentLocation = Recommendations.instance.currentLocation;
    this.locations = Recommendations.instance.locations;
    this.searchTerm = null;
    this.results = null;
    this.placeholderText = 'Search in ' + this.locations.length + ' places (e.g., Sushi or Burger)';
    this.profile = await this.profileApi.loadUserProfile();
    this.initialized = true;
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

  async setFoodFilter(filter: FoodFilterItem) {
    filter.selected = !filter.selected;
    await this.profileApi.saveUserProfile(this.profile);
    this.refresh(this.recommendations.currentLocation.lat, this.recommendations.currentLocation.lng);
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

  presentAlert(title: string, text: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }

  /*

  async initialize() {
    //let r = await this.recommendApi.loadRecommendations();
    if(this.recommendations!=null) {
      //this.currentLocation = this.recommendations.currentLocation;
      this.profile = this.recommendations.profile;
      //this.recommendations = r;
    }
    else {
      // fallback
      //this.currentLocation = new GoogleLocation();
      this.currentLocation.address = 'Tap here to get started';
      this.profile = await this.profileApi.loadUserProfile();
    }
  }

  ionViewDidLoad() {
  }

  async getRecommendations() {
    try {
      let r = await this.recommendApi.loadRecommendations();
      this.recommendations = r;
    }
    catch(err) {
      console.log('recommendations error', err);
      alert('Something went wrong in loading recommendations. We will try again in a few moments.');
    }
  }
  */

  searchCleared() {
    this.results = null;
  }

  //formatDistance(distance : number) : string {
  //  return distance.toFixed(2) + ' mi';
  //}

  navigateToLocationMenu(loc : FxLocation)
  {
    this.navCtrl.push(LocationMenuPage,
      {
        location : loc,
      });
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
        this.refresh(this.recommendations.currentLocation.lat, this.recommendations.currentLocation.lng);
        this.profile = profile;
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
      this.presentAlert('Error', 'An unexpected error occured while getting results. Please wait a few minutes and retry.')
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
