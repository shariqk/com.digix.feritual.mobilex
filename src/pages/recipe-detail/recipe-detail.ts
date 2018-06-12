import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { Recipe } from '../../providers/feritual-api/feritual-api.model';
import { UserProfile } from '../../providers/userprofile-api/userprofile.model';
import { UserprofileApiProvider } from '../../providers/userprofile-api/userprofile-api';
import { RecipeHelper } from '../../providers/feritual-api/feritual-helper';


@IonicPage()
@Component({
  selector: 'page-recipe-detail',
  templateUrl: 'recipe-detail.html',
})
export class RecipeDetailPage {

  recipe : Recipe;
  profile : UserProfile;
  isFavorite : boolean;

  constructor(public navCtrl: NavController,
    private browser: InAppBrowser,
    private profileApi: UserprofileApiProvider,
    public navParams: NavParams) {
      this.initialize();
    //console.log('recipe', this.recipe);
    //console.log('totalDaily', this.getObjectArray(this.recipe.totalDaily));
  }

  async initialize() {
    this.recipe = this.navParams.get('recipe');
    this.profile = await this.profileApi.loadUserProfile();
    this.isFavorite = RecipeHelper.isFavoriteRecipe(this.profile, this.recipe);
  }

  async favoriteToggle(r : Recipe) {
    var flag = !this.isFavorite;
    if (RecipeHelper.setFavoriteRecipe(this.profile, r, flag)) {
      await this.profileApi.saveUserProfile(this.profile);
      console.log('favorites', this.profile.favoriteRecipes);
      this.isFavorite = flag;
    }
  }

  getObjectArray(obj : any) : object[] {
    let keys = Object.keys(obj);
    let values = [];

    for(var key of keys) {
      values.push(obj[key]);
    }

    return values;
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
