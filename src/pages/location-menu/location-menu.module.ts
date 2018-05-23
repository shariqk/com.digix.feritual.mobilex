import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LocationMenuPage } from './location-menu';

@NgModule({
  declarations: [
    LocationMenuPage,
  ],
  imports: [
    IonicPageModule.forChild(LocationMenuPage),
  ],
})
export class LocationMenuPageModule {}
