import { Component } from '@angular/core';

import { FoodPage } from '../food/food';
import { AnalyzePage } from '../analyze/analyze';


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = FoodPage;
  tab3Root = AnalyzePage;

  constructor() {

  }
}
