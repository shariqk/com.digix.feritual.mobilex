import { Component } from '@angular/core';

import { FoodPage } from '../food/food';
import { AnalyzePage } from '../analyze/analyze';
import { RecipesPage } from '../recipes/recipes';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = FoodPage;
  tab2Root = RecipesPage;
  tab3Root = HomePage; // AnalyzePage;

  constructor() {

  }
}
