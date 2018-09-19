import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { Scroll } from 'ionic-angular';

import { FxLocation } from '../../providers/feritual-api/feritual-api.model';
import { Helper } from '../../providers/feritual-api/feritual-helper';
import { NavController } from 'ionic-angular';

import { LocationMenuPage } from '../../pages/location-menu/location-menu';

@Component({
  selector: 'eat-out-vertical-strip',
  templateUrl: 'eat-out-vertical-strip.html'
})
export class EatOutVerticalStripComponent implements OnChanges {

  private locations: FxLocation[];
  private callBackOnScroll: any;
  private panel_scrolling: boolean;
  @ViewChild('scrollPanel') scrollPanel: Scroll;

  constructor(private navCtrl: NavController) {

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

  formatDistance(distance : number) : string {
    return distance.toFixed(2) + ' mi';
  }

  public setLocations(locations: FxLocation[]) {
    this.locations = locations;
    console.log('setLocations', this.locations);
  }

  public setCallBackOnScroll(func: any)
  {
    this.setCallBackOnScroll = func;


    this.scrollPanel.addScrollEventListener(($event: any) => {
      //console.log('$event', event);
      if(!this.panel_scrolling && this.callBackOnScroll != null) {
        window.setTimeout(() => {
          this.callBackOnScroll();
          //this.autoSelectMapMarker();
          this.panel_scrolling = false;
        }, 1000);
        this.panel_scrolling = true;
      }
    });

  }

  public scrollTo(elementId: string) {
    let e = document.getElementById(elementId).parentElement;
    if(e!=null) {
      e.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
    }
  }

  ngOnChanges() {

  }


}
