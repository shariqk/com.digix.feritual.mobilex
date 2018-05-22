import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddressPickerPage } from './address-picker';

@NgModule({
  declarations: [
    AddressPickerPage,
  ],
  imports: [
    IonicPageModule.forChild(AddressPickerPage),
  ],
})
export class AddressPickerPageModule {}
