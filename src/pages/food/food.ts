import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

import { FoodApiProvider } from '../../providers/food-api/food-api';
import { LocationSearchResult } from '../../providers/food-api/food-api.model';

@IonicPage()
@Component({
  selector: 'page-food',
  templateUrl: 'food.html',
})
export class FoodPage {

  nearme : LocationSearchResult;
  searchTerm : string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public api : FoodApiProvider) {
  }

  ionViewDidLoad() {
    if(this.nearme == null) {
      this.getLocations();
    }
  }

  doSearch(event : any) {
    if(this.nearme==null || this.searchTerm==null || this.searchTerm.length<4) {
      return;
    }

    var brands = new Array();
    for(var l of this.nearme.locations) {
      brands.push(l.brand_id);
    }

    this.api.searchForFood(brands, this.searchTerm)
      .subscribe(data => {
        console.log('results', data);
        //alert('success');
      },
      error =>
      {
        alert(error.message);
        console.log(error);
      });
    }

  doLocationMenuSearch(event : any) {
    if(this.nearme==null || this.searchTerm==null || this.searchTerm.length<4) {
      return;
    }

    var counter=0;
    for(var loc of this.nearme.locations) {
      if(counter>4) { break; }

      this.api.searchLocationMenu([loc.brand_id], this.searchTerm)
        .subscribe(data => {
          console.log('results', data);
          //alert('success');
        },
        error =>
        {
          alert(error.message);
          console.log(error);
        });

        counter++;
      }

    }


  getLocations() {
    var lat = 40.034804;
    var lng = -75.301198;
    let toast = this.toastCtrl.create({
        message: 'Loading locations near you',
        position: 'top'
      });
    toast.present();
    
    this.api.getLocations(lat, lng)
      .subscribe(data => {
        this.nearme = data;
        console.log('locations', data);
        toast.dismiss();
      },
      error =>
      {
        toast.dismiss();
        alert(error.message);
        console.log(error);
      });
    }
}
