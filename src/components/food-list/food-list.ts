import { Component, OnChanges, Input} from '@angular/core';

import { FoodLocation, FoodLocationMenu, FoodLocationMenuItem } from '../../providers/food-api/food-api.model';
import { FoodApiProvider } from '../../providers/food-api/food-api';


@Component({
  selector: 'food-list',
  templateUrl: 'food-list.html'
})
export class FoodListComponent implements OnChanges {

  @Input('location') location : FoodLocation;
  @Input('menu') menu : FoodLocationMenu;

  topHitCount = 3;
  topHits : FoodLocationMenuItem[];
  avatarUrl = 'https://www.toornament.com/media/file/433393387804137561/logo_large?v=1477168110';

  expandedView = false;
  expandViewTitle = 'Expand';

  constructor() {
  }

  switchExpandedView() {
    this.expandedView = !this.expandedView;
    this.expandViewTitle = this.expandedView ? 'Collapse' : 'Expand';
    console.log('state: ', this.expandedView, 'title: ', this.expandViewTitle);
  }



  ngOnChanges() {
    //console.log('menu', this.menu);
    //console.log('location', this.location);
    this.topHits=[];
    for(var i=0; i<this.topHitCount; i++) {
      if(i<this.menu.hits.length)
      {
        this.topHits.push(this.menu.hits[i]);
      }
    }

  }


  
}
