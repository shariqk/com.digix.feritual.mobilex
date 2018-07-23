import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController  } from 'ionic-angular';
//import { InAppBrowser } from '@ionic-native/in-app-browser';

import { FeritualApiProvider } from '../../providers/feritual-api/feritual-api';
import { UserprofileApiProvider } from '../../providers/userprofile-api/userprofile-api';
import { RecommendationApiProvider } from '../../providers/recommendation-api/recommendation-api';
import { Hit, Recipe } from '../../providers/feritual-api/feritual-api.model';
import { Recommendations } from '../../providers/recommendation-api/recommendation-api.model';
import { RecipeDetailPage } from '../recipe-detail/recipe-detail';
import { UserProfile, UserProfileHelper } from '../../providers/userprofile-api/userprofile.model';
import { Helper } from '../../providers/feritual-api/feritual-helper';

@IonicPage()
@Component({
  selector: 'page-recipes',
  templateUrl: 'recipes.html',
})
export class RecipesPage {
  profile: UserProfile;
  searchTerm : string;
  placeholderText : string = 'Type an ingredient to search for';
  hits : Hit[];
  view : string = 'grid';
  recommendations : Recommendations;

  constructor(public navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private ferApi: FeritualApiProvider,
    private profileApi: UserprofileApiProvider,
    private recommendApi: RecommendationApiProvider,
    //private browser: InAppBrowser,
    public navParams: NavParams) {
      this.initialize();

      Recommendations.onReload((val => {
        console.log('recommendations were reloaded');
        this.initialize();
      }));
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad RecipesPage');
  }

  //get recommendations() : Recommendations {
      //return Recommendations.instance;
  //}

  async initialize() {
    this.recommendations = Recommendations.instance;
    this.profile = await this.profileApi.loadUserProfile();

    //this.recommendations = await this.recommendApi.loadRecommendations();
    /*
    if(this.recommendations != null)
    {
      this.profile = this.recommendations.profile;
    }
    else {
      this.profile = await this.profileApi.loadUserProfile();
    }
    */
  }

  /*
  async loadProfile() {
    this.profile = await this.profileApi.loadUserProfile();
  }

  async getRecommendations() {
    try {
      let r = await this.recommendApi.loadRecommendations();
      this.recommendations = r;
    }
    catch(err) {
      console.log('recommendations error', err);
      alert('Something went wrong in loading recommendations. We will try again in a few moments.');
    }
  }
  */

  getDetails(r : Recipe) : string {
    let str = 'Serves ' + r.yield
          + ', ' + Math.floor(r.calories) + ' calories';
    return str;
  }

  startSearch(keywords : string[]) {
    if(keywords!=null && keywords.length>0) {
      this.searchTerm = keywords[0];
      this.doRecipeSearch(null);
    }
  }

  navigateToRecipe(r : Recipe) {
    this.navCtrl.push(RecipeDetailPage,
      {
        recipe : r
      });
  }

  concatStrArray(items : string[]) : string {
    return Helper.concatStrArray(items);
  }

  async doRecipeSearch(event : any) {
    let loading = this.loadingCtrl.create({
       content: 'Please wait...'
     });
    loading.present();

    try {
      let result = await this.ferApi.searchForRecipes(this.searchTerm, 0, 100);
      this.saveSearchTerm(this.searchTerm);
      //console.log('recipes', result);
      this.hits = result.hits;
    }
    catch(err) {
      alert('Error in loading menu:' + JSON.stringify(err));
    }
    finally {
      loading.dismiss();
    }
  }

  async saveSearchTerm(searchTerm : string) {
    if(UserProfileHelper.addRecipeSearch(this.profile, searchTerm))
    {
      await this.profileApi.saveUserProfile(this.profile);
    }
  }

  searchCleared() {
    this.hits = null;
  }

}
