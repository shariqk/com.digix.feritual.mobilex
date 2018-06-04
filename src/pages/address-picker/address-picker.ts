import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController} from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

import { GoogleApiProvider } from '../../providers/google-api/google-api';
import { GoogleLocation, AutocompleteResult } from '../../providers/google-api/google-api.model';

import { UserprofileApiProvider } from '../../providers/userprofile-api/userprofile-api';
import { UserProfile } from '../../providers/userprofile-api/userprofile.model';

@IonicPage()
@Component({
  selector: 'page-address-picker',
  templateUrl: 'address-picker.html',
})
export class AddressPickerPage {

  profile : UserProfile;
  searchAddress : string;
  suggestedAddress : string[];// = ['JFK', 'PHL', 'Bryn Mawr'];
  editingAddress = false;

  constructor(public navCtrl: NavController,
    public loadingCtrl : LoadingController,
    public viewCtrl : ViewController,
    private geolocation: Geolocation,
    private profileApi : UserprofileApiProvider,
    public googleApi : GoogleApiProvider,
    public navParams: NavParams) {
      this.initialize();
    /*
    this.recentAddressList = [
      "645 Morris Ave, Bryn Mawr, PA 19010",
      "2300 Byberry Road, Bensalem, PA 19020",
      "New York, NY",
      "San Francisco, CA"
    ];
    */
  }

  async initialize() {
    let profile = await this.profileApi.loadUserProfile();
    if(profile.recentAddressList==null) {
      profile.recentAddressList = [];
       await this.profileApi.saveUserProfile(profile);
    }
    this.profile = profile;
  }

  async lookupAddress() {
    if(this.searchAddress.length<3) {
      this.suggestedAddress = [];
      return;
    }

    let places : string[] = [];
    let result = await this.googleApi.getAutocompleteAddressAsync(this.searchAddress);
    for(let p of result.predictions) {
      places.push(p.description);
    }
    this.suggestedAddress = places;
  }



  searchClicked() {
    if(this.searchAddress !=null && this.searchAddress != '')
    {
      this.addressSelected(this.searchAddress);
    }
  }

  async removeRecentAddress(address : string) {
    let list = this.profile.recentAddressList;
    let index = list.indexOf(address);
    if (index > -1) {
      list.splice(index, 1);
      await this.profileApi.saveUserProfile(this.profile);
    }
  }

  async nearbySelected() {
    let loader = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });
    loader.present();

    try {
      var loc = await this.determineLocation();
      if(loc==null) {
        alert('Could not determine current location');
      }
      else {
        this.saveRecentAddress(loc.address);
        this.viewCtrl.dismiss(loc);
      }
    }
    catch (err) {
      alert(JSON.stringify(err));
    }
    finally {
      loader.dismiss();
    }
  }

  async addressSelected(address : string) {
    let loader = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });
    loader.present();

    try {
      var loc = await this.getLatLng(address);
      if(loc==null) {
        alert('"' + address + '" is not a valid address');
      }
      else {
        this.saveRecentAddress(loc.address);

        this.viewCtrl.dismiss(loc);
      }
    }
    catch (err) {
      //console.log('addressSelected', err);
      alert(JSON.stringify(err));
    }
    finally {
      loader.dismiss();
    }
  }

  async determineLocation() : Promise<GoogleLocation> {
    var pos = await this.geolocation.getCurrentPosition({timeout: 20000, enableHighAccuracy: false});
    //console.log('current position', pos);
    let loc = await this.googleApi.getLocationFromLatLng(pos.coords.latitude, pos.coords.longitude);
    //console.log('current position', loc);

    return loc;
  }

  async saveRecentAddress(address : string) {
    if(this.profile.recentAddressList==null)
    {
      this.profile.recentAddressList = [];
    }

    if(this.profile.recentAddressList.indexOf(address)<0) {
      this.profile.recentAddressList.push(address);
      await this.profileApi.saveUserProfile(this.profile)

    }
  }


  ionViewDidLoad() {

  }

  getLatLng(address : string) : Promise<GoogleLocation> {
    let ctx = this;
    return new Promise(function(resolve, reject) {
      ctx.googleApi.getLatLng(address)
        .subscribe(data => {
          if(data.status.toLowerCase()=='ok') {
            console.log("getLatLng('"+ address+ "')", data);
            var g = new GoogleLocation();

            for(var r of data.results) {
              g.lat = r.geometry.location.lat;
              g.lng = r.geometry.location.lng;
              g.address = r.formatted_address;
              break;
            }
            resolve(g);
          }
          else {
            resolve(null);
          }
        },
        error =>
        {
          console.log(error);
          reject(error);
        });
    });


  }

  cancelClicked() {
    this.viewCtrl.dismiss(null);
  }


}
