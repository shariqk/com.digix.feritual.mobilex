import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

import { FeritualApiProvider } from '../../providers/feritual-api/feritual-api';
//import { UserprofileApiProvider } from '../../providers/userprofile-api/userprofile-api';
//import { RecommendationApiProvider } from '../../providers/recommendation-api/recommendation-api';
import { Hit, Recipe } from '../../providers/feritual-api/feritual-api.model';
import { Recommendations } from '../../providers/recommendation-api/recommendation-api.model';
import { RecipeDetailPage } from '../recipe-detail/recipe-detail';
import { UserProfile, UserProfileHelper } from '../../providers/userprofile-api/userprofile.model';
import { Helper } from '../../providers/feritual-api/feritual-helper';


@IonicPage()
@Component({
  selector: 'page-recipe-search-result',
  templateUrl: 'recipe-search-result.html',
})
export class RecipeSearchResultPage {

  private initialized: boolean = false;
  private searchTerm: string;
  private profile: UserProfile;
  private view: string = 'grid';
  private hits: Hit[];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private ferApi: FeritualApiProvider)
  {
    this.initialize();

    Recommendations.onReload('recipeSearchResult', (val => {
      console.log('recommendations were reloaded');
      this.initialize();
    }));

  }

  ionViewDidLoad() {
  }

  ionViewWillUnload() {
    Recommendations.onReloadRemove('recipeSearchResult');
  }

  async initialize() {
    this.searchTerm = this.navParams.get('query');
    this.profile = this.navParams.get('profile');

    await this.doRecipeSearch(null);
    this.initialized = true;
  }

  getDetails(r : Recipe) : string {
    let str = 'Serves ' + r.yield
          + ', ' + Math.floor(r.calories) + ' calories';
    return str;
  }

  concatStrArray(items : string[]) : string {
    return Helper.concatStrArray(items);
  }

  navigateToRecipe(r : Recipe) {
    this.navCtrl.push(RecipeDetailPage,
      {
        recipe : r
      });
  }

  async doRecipeSearch(event : any) {
    let loading = this.loadingCtrl.create({
       content: 'Please wait...'
     });
    loading.present();

    try {
      let result = await this.ferApi.searchForRecipes(this.searchTerm, 0, 100);
      //this.saveSearchTerm(this.searchTerm);
      //console.log('recipes', result);
      this.hits = result.hits;
    }
    catch(err) {
      alert('An unexpected error occured while searching for recipes. Please wait a few minutes and retry');
    }
    finally {
      loading.dismiss();
    }
  }


}
