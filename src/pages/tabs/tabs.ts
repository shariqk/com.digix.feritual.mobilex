import { Component } from '@angular/core';

import { FoodPage } from '../food/food';
import { ProfilePage } from '../profile/profile';
import { AnalyzePage } from '../analyze/analyze';


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = FoodPage;
  tab2Root = ProfilePage;
  tab3Root = AnalyzePage;

  constructor() {

  }
}
