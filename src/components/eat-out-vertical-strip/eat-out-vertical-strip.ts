import { Component, Input, OnChanges, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { Scroll, Gesture } from 'ionic-angular';

import { FxLocation } from '../../providers/feritual-api/feritual-api.model';
import { Helper } from '../../providers/feritual-api/feritual-helper';
import { NavController } from 'ionic-angular';

import { LocationMenuPage } from '../../pages/location-menu/location-menu';

@Component({
  selector: 'eat-out-vertical-strip',
  templateUrl: 'eat-out-vertical-strip.html'
})
export class EatOutVerticalStripComponent implements OnChanges, AfterViewInit {

  private locations: FxLocation[];
  private callBackOnScroll: any;
  private callBackOnTopClick: any;

  private panel_scrolling: boolean;
  private maximized: boolean = false;
  @ViewChild('scrollPanel') scrollPanel: Scroll;
  private scrollPanelContent: ElementRef;

  constructor(private navCtrl: NavController) {

  }

  tapEvent(event: Gesture) {
    if(this.callBackOnTopClick!=null) {
      this.maximized = !this.maximized;
      this.callBackOnTopClick(this.maximized);
    }
    console.log('event', event);
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
    this.callBackOnScroll = func;
  }

  public setCallBackOnTopClick(func: any)
  {
    this.callBackOnTopClick = func;
  }
  
  ngAfterViewInit() {
    this.scrollPanelContent = this.scrollPanel._scrollContent;

    this.scrollPanel.addScrollEventListener(($event: any) => {
      //console.log('$callBackOnScroll', this.callBackOnScroll);
      if(!this.panel_scrolling && this.callBackOnScroll != null) {
        window.setTimeout(() => {
          let p = this.scrollPanelContent.nativeElement as HTMLElement;
          let offset = p.scrollTop;
          let locId = null;

          this.callBackOnScroll(offset);
          this.panel_scrolling = false;
        }, 1000);
        this.panel_scrolling = true;
      }
    });
  }

  public getElementById(locationId: string) {
    let e = document.getElementById(locationId).parentElement;
    return e;
  }

  public scrollTo(locationId: string) {
    let e = document.getElementById(locationId).parentElement;
    if(e!=null) {
      e.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
    }
  }

  ngOnChanges() {

  }


}
