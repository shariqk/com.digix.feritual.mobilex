import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RecipeSearchResultPage } from './recipe-search-result';

@NgModule({
  declarations: [
    RecipeSearchResultPage,
  ],
  imports: [
    IonicPageModule.forChild(RecipeSearchResultPage),
  ],
})
export class RecipeSearchResultPageModule {}
