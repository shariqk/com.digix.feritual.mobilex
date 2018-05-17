import { Component, OnInit, Input} from '@angular/core';

import { Location, LocationMenu, LocationMenuItem } from '../../providers/food-api/food-api.model';
import { FoodApiProvider } from '../../providers/food-api/food-api';


@Component({
  selector: 'food-list',
  templateUrl: 'food-list.html'
})
export class FoodListComponent implements OnInit {

  @Input() public location: Location;
  @Input() public menu : LocationMenu;

  constructor() {
  }

  ngOnInit() {
    console.log('this.location', this.location.name);

  }

  public initialize(loc : Location, menu : LocationMenu) {
    this.location = loc;
    this.menu = menu;
  }

}
