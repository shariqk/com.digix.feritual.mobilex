import { Component } from '@angular/core';

import { FoodPage } from '../food/food';
import { AnalyzePage } from '../analyze/analyze';
import { RecipesPage } from '../recipes/recipes';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = FoodPage;
  tab2Root = RecipesPage;
  tab3Root = AnalyzePage;

  constructor() {

  }
}
