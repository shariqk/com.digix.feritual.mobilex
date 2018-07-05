import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController  } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { FeritualApiProvider } from '../../providers/feritual-api/feritual-api';
import { UserprofileApiProvider } from '../../providers/userprofile-api/userprofile-api';
import { Hit, Recipe, Recommendations } from '../../providers/feritual-api/feritual-api.model';
import { RecipeDetailPage } from '../recipe-detail/recipe-detail';
import { UserProfile } from '../../providers/userprofile-api/userprofile.model';

@IonicPage()
@Component({
  selector: 'page-recipes',
  templateUrl: 'recipes.html',
})
export class RecipesPage {

  searchTerm : string;
  placeholderText : string = 'Type an ingredient to search for';
  hits : Hit[];
  view : string = 'grid';
  recommendations : Recommendations;

  constructor(public navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private ferApi: FeritualApiProvider,
    private profileApi: UserprofileApiProvider,
    private browser: InAppBrowser,
    public navParams: NavParams) {
      this.getRecommendations();
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad RecipesPage');
  }

  async getRecommendations() {
    if(Recommendations.instance==null) {
      let profile = await this.profileApi.loadUserProfile();
      let r = await this.ferApi.getRecommendations(profile, -1, -1);
      console.log('Recommendations', r);

      for(let g of r.items)
      {
        if(g.recipes.length>9) {
          g.recipes.splice(9);
        }
      }

      Recommendations.instance = r;
    }

    this.recommendations = Recommendations.instance;
  }

  getDetails(r : Recipe) : string {
    let str = 'Serves ' + r.yield
          + ', ' + Math.floor(r.calories) + ' calories';
    return str;
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

  searchCleared() {
    this.hits = null;
  }

}
