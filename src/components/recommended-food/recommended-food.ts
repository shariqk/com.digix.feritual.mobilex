import { Component, OnChanges, Input} from '@angular/core';

import { Recommendations } from '../../providers/recommendation-api/recommendation-api.model';
import { MenuHelper } from '../../providers/feritual-api/feritual-helper';
import { FxLocationMenuItem } from '../../providers/feritual-api/feritual-api.model';

@Component({
  selector: 'recommended-food',
  templateUrl: 'recommended-food.html'
})
export class RecommendedFoodComponent implements OnChanges {

  @Input('recommendations') recommendations : Recommendations;

  constructor() {
    //console.log('Hello RecommendedFoodComponent Component');
  }

  previewList(items: FxLocationMenuItem[]) : FxLocationMenuItem[] {
    let list: FxLocationMenuItem[] = [];
    for(let m of items) {
      list.push(m);
      if(list.length>2)
      {
        break;
      }
    }
    return list;
  }

  ngOnChanges() {
    //console.log('recommendations', this.recommendations);
    for(let c of this.recommendations.items) {
      if(c.menuItems!=null) {
        for(let m of c.menuItems) {
          MenuHelper.fixMenuItemPhotoUrl(m);
        }
      }
    }
  }
}
