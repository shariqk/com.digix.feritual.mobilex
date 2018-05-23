import { Component, OnChanges, Input} from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ModalController } from 'ionic-angular';

import { FoodLocation, FoodLocationMenu, FoodLocationMenuItem } from '../../providers/food-api/food-api.model';
import { FoodApiProvider } from '../../providers/food-api/food-api';
import { FxLocationMenu, FxLocationMenuItem } from '../../pages/food/foodSearch';

import { LocationMenuPage } from '../../pages/location-menu/location-menu';

@Component({
  selector: 'food-list',
  templateUrl: 'food-list.html'
})
export class FoodListComponent implements OnChanges {

  //@Input('location') location : FoodLocation;
  //@Input('menu') menu : FoodLocationMenu;
  @Input('menu') menu : FxLocationMenu;

  topHitCount = 3;
  topHits : FxLocationMenuItem[];
  avatarUrl = 'https://www.toornament.com/media/file/433393387804137561/logo_large?v=1477168110';

  expandedView = false;
  expandViewTitle = 'Expand';

  constructor(
    public navParams : NavParams,
    public navCtrl : NavController) {
  }

  switchExpandedView() {
    this.expandedView = !this.expandedView;
    this.expandViewTitle = this.expandedView ? 'Collapse' : 'Expand';
    //console.log('state: ', this.expandedView, 'title: ', this.expandViewTitle);
  }

  navigateToLocationMenu()
  {
    this.navCtrl.push(LocationMenuPage,
      {
        location : this.menu.location
      });
  }

  ngOnChanges() {
    //console.log('menu', this.menu);
    //console.log('location', this.location);
    this.topHits=[];
    for(var i=0; i<this.topHitCount; i++) {
      if(i<this.menu.items.length)
      {
        this.topHits.push(this.menu.items[i]);
      }
    }

  }



}
