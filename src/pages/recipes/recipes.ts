import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
//import { InAppBrowser } from '@ionic-native/in-app-browser';

import { FeritualApiProvider } from '../../providers/feritual-api/feritual-api';
import { UserprofileApiProvider } from '../../providers/userprofile-api/userprofile-api';
import { RecommendationApiProvider } from '../../providers/recommendation-api/recommendation-api';
import { Hit, Recipe } from '../../providers/feritual-api/feritual-api.model';
import { Recommendations } from '../../providers/recommendation-api/recommendation-api.model';
import { RecipeDetailPage } from '../recipe-detail/recipe-detail';
import { RecipeSearchResultPage } from '../recipe-search-result/recipe-search-result';
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
  //hits : Hit[];
  view : string = 'grid';
  recommendations : Recommendations;

  constructor(public navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private ferApi: FeritualApiProvider,
    private profileApi: UserprofileApiProvider,
    private recommendApi: RecommendationApiProvider,
    //private browser: InAppBrowser,
    public navParams: NavParams) {
      this.initialize();

      Recommendations.onReload('recipes', (val => {
        console.log('recommendations were reloaded');
        this.initialize();
      }));
  }

  ionViewDidLoad() {
  }

  async initialize() {
    this.recommendations = Recommendations.instance;
    this.profile = await this.profileApi.loadUserProfile();

  }


  getDetails(r : Recipe) : string {
    let str = 'Serves ' + r.yield
          + ', ' + Math.floor(r.calories) + ' calories';
    return str;
  }

  startSearch(keywords : string[]) {
    if(keywords!=null && keywords.length>0) {
      let query = keywords[0];
      this.searchTerm = query;
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

  async doRecipeSearch(event: any)
  {
    if(this.searchTerm==null || this.searchTerm.trim()=='')
    {
      this.presentAlert('Oops', 'Please specify ingredients or cuisine to search for.');
      return;
    }

    this.navCtrl.push(RecipeSearchResultPage,
      {
        query : this.searchTerm,
        profile: this.profile
      });

      if(UserProfileHelper.addRecipeSearch(this.profile, this.searchTerm))
      {
        await this.profileApi.saveUserProfile(this.profile);
      }
  }

  presentAlert(title: string, text: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }


  /*
  async _doRecipeSearch(event : any) {
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
  */
}
