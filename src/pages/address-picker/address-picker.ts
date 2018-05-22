import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController} from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

import { GoogleApiProvider } from '../../providers/google-api/google-api';
import { GoogleLocation } from '../../providers/google-api/google-api.model';

@IonicPage()
@Component({
  selector: 'page-address-picker',
  templateUrl: 'address-picker.html',
})
export class AddressPickerPage {

  recentAddressList : string[];
  searchAddress : string;

  constructor(public navCtrl: NavController,
    public loadingCtrl : LoadingController,
    public viewCtrl : ViewController,
    private geolocation: Geolocation,
    public googleApi : GoogleApiProvider,
    public navParams: NavParams) {

    this.recentAddressList = [
      "645 Morris Ave, Bryn Mawr, PA 19010",
      "2300 Byberry Road, Bensalem, PA 19020",
      "New York, NY",
      "San Francisco, CA"
    ];
  }

  doLocationSearch(event : any) {

  }

  searchClicked() {
    this.addressSelected(this.searchAddress);
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

  async determineLocation() : Promise<GoogleLocation> {
    var pos = await this.geolocation.getCurrentPosition({timeout: 20000, enableHighAccuracy: false});
    console.log('current position', pos);
    let loc = await this.googleApi.getLocationFromLatLng(pos.coords.latitude, pos.coords.longitude);
    console.log('current position', loc);

    return loc;
  }

  determineLocation2() : Promise<GoogleLocation> {
    let ctx = this;
    return new Promise(function(resolve, reject) {
      ctx.geolocation.getCurrentPosition({timeout: 20000, enableHighAccuracy: false})
        .then(res => {
          console.log('current position', res);
          let loc = ctx.googleApi.getLocationFromLatLng(res.coords.latitude, res.coords.longitude);
          /*
          ctx.googleApi.getLocationFromLatLng(res.coords.latitude, res.coords.longitude)
            .then(loc => {
              console.log('current location', loc);

              resolve(loc);
            },
            error =>
            {
              console.log(error);

              //alert('Could not get current address from lat, lng');
              reject(error);
            }); */
        })
        .catch(
          (err) => {
            console.log(err);
            //alert('Could not read current location');
            reject(err);
          });
    });
  }


  ionViewDidLoad() {

  }

  getLatLng(address : string) : Promise<GoogleLocation> {
    let ctx = this;
    return new Promise(function(resolve, reject) {
      ctx.googleApi.getLatLng(address)
        .subscribe(data => {
          if(data.status.toLowerCase()=='ok') {
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
