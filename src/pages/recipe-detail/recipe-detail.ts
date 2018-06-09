import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Recipe } from '../../providers/feritual-api/feritual-api.model';
import { InAppBrowser } from '@ionic-native/in-app-browser';


@IonicPage()
@Component({
  selector: 'page-recipe-detail',
  templateUrl: 'recipe-detail.html',
})
export class RecipeDetailPage {

  recipe : Recipe;

  constructor(public navCtrl: NavController,
    private browser: InAppBrowser,
    public navParams: NavParams) {
    this.recipe = this.navParams.get('recipe');
    console.log('recipe', this.recipe);
  }

  navigateToRecipe(r : Recipe) {
    this.browser.create(r.url);
  }

  floor(n: number) {
      return Math.floor(n).toLocaleString();
  }

  ionViewDidLoad() {
  }

}
