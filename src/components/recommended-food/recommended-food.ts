import { Component, OnChanges, Input} from '@angular/core';
import { NavController } from 'ionic-angular';

import { Recommendations } from '../../providers/recommendation-api/recommendation-api.model';
import { MenuHelper } from '../../providers/feritual-api/feritual-helper';
import { FxLocation, FxLocationMenuItem } from '../../providers/feritual-api/feritual-api.model';
import { LocationMenuPage } from '../../pages/location-menu/location-menu';
import { Helper } from '../../providers/feritual-api/feritual-helper';

@Component({
  selector: 'recommended-food',
  templateUrl: 'recommended-food.html'
})
export class RecommendedFoodComponent implements OnChanges {

  @Input('title') title : string;
  @Input('items') items : FxLocationMenuItem[];
  @Input('keywords') keywords: string[];
  @Input('location') location: FxLocation;

  private previewList: FxLocationMenuItem[];
  private expandViewTitle: string = 'Expand >>';
  private expanded: boolean = false;

  constructor(private navCtrl: NavController) {
  }

  switchExpandedView() {
    this.expanded = !this.expanded;
    this.expandViewTitle = this.expanded ? 'Collapse <<' : 'Expand >>';
  }

  formatDistance(distance : number) : string {
    return distance.toFixed(2) + ' mi';
  }

  concatStrArray(items : string[]) : string {
    return Helper.concatStrArray(items);
  }

  navigateToLocationMenu(loc: FxLocation) {
    this.navCtrl.push(LocationMenuPage,
      {
        location: loc
      });
  }

  ngOnChanges() {
    let list: FxLocationMenuItem[] = [];

    for(let m of this.items) {
      MenuHelper.fixMenuItemPhotoUrl(m);

      if(list.length<3)
      {
        list.push(m);
      }
    }

    this.previewList = list;
  }
}
