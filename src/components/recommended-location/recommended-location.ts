import { Component, OnChanges, Input} from '@angular/core';
import { Recommendations } from '../../providers/recommendation-api/recommendation-api.model';
import { NavController } from 'ionic-angular';

import { LocationMenuPage } from '../../pages/location-menu/location-menu';
import { FxLocationMenu, FxIcons } from '../../providers/feritual-api/feritual-api.model';
import { Helper, MenuHelper } from '../../providers/feritual-api/feritual-helper';


@Component({
  selector: 'recommended-location',
  templateUrl: 'recommended-location.html'
})
export class RecommendedLocationComponent implements OnChanges {

  @Input('recommendations') recommendations : Recommendations;

  constructor(
    private navCtrl: NavController
  ) {
  }

  startSearch(term : string)
  {

  }

  formatDistance(distance : number) : string {
    return distance.toFixed(2) + ' mi';
  }

  concatStrArray(items : string[]) : string {
    return Helper.concatStrArray(items);
  }


  navigateToLocationMenu(loc : FxLocationMenu)
  {
    this.navCtrl.push(LocationMenuPage,
      {
        location: this.recommendations.currentLocation,
      });
  }

  ngOnChanges() {
    //console.log('recommendations', this.recommendations);

    for(let g of this.recommendations.items) {
      if(g.locations!=null) {
        for(let loc of g.locations) {
          if(loc.logoUrl==null) {
            loc.logoUrl = FxIcons.getIcon(loc.name);
          }
          //console.log(loc);
          //MenuHelper.fixMenuItemPhotoUrl(m);
        }
      }
    }

  }

}
