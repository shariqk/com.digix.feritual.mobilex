import { Component } from '@angular/core';

import { RecipesPage } from '../recipes/recipes';
import { HomePage } from '../home/home';
import { ExplorePage } from '../explore/explore';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = ExplorePage;
  tab2Root = HomePage; // AnalyzePage;
  tab3Root = RecipesPage;

  constructor() {

  }
}
