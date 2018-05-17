import { Component, OnInit, AfterContentInit, Input} from '@angular/core';

import { FoodLocation, FoodLocationMenu, FoodLocationMenuItem } from '../../providers/food-api/food-api.model';
import { FoodApiProvider } from '../../providers/food-api/food-api';


@Component({
  selector: 'food-list',
  templateUrl: 'food-list.html'
})
export class FoodListComponent implements OnInit, AfterContentInit {

  //@Input('location') loc: any;
  //@Input() menu : LocationMenu;
  loc : FoodLocation;
  menu : FoodLocationMenu;

  constructor() {
  }

  public initialize(loc : FoodLocation, menu : FoodLocationMenu) {
    this.loc = loc;
  }

  ngOnInit() {
    //console.log('this.location', this.location);

  }

  ngAfterContentInit() {
    //console.log('this.location', this.location);

  }

}
