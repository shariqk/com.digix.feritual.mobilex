import { Component, OnChanges, Input } from '@angular/core';

import { NavController } from 'ionic-angular';

import { LocationMenuPage } from '../../pages/location-menu/location-menu';
import { FxLocation, FxLocationMenu, FxIcons } from '../../providers/feritual-api/feritual-api.model';
import { Helper, MenuHelper } from '../../providers/feritual-api/feritual-helper';
import { UserprofileApiProvider } from '../../providers/userprofile-api/userprofile-api';

@Component({
  selector: 'location-list',
  templateUrl: 'location-list.html'
})
export class LocationListComponent implements OnChanges {

  @Input('locations') locations : FxLocation[];
  @Input('title') title : string = null;

  constructor(private navCtrl: NavController, private profileApi: UserprofileApiProvider) {
  }

  formatDistance(distance : number) : string {
    return distance.toFixed(2) + ' mi';
  }

  concatStrArray(items : string[]) : string {
    return Helper.concatStrArray(items);
  }


  async navigateToLocationMenu(loc : FxLocationMenu)
  {
    let profile = await this.profileApi.loadUserProfile();

    this.navCtrl.push(LocationMenuPage,
      {
        location: loc,
        profile: profile
      });
  }

  ngOnChanges() {
    //console.log('locations', this.locations);
    if(this.locations==null) { return; }

    for(let loc of this.locations) {
      if(loc.logoUrl==null) {
        loc.logoUrl = FxIcons.getIcon(loc.name);
      }
          //console.log(loc);
          //MenuHelper.fixMenuItemPhotoUrl(m);
      }
    }

}
