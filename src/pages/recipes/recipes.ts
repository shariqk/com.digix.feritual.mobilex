import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController, Content } from 'ionic-angular';
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
  @ViewChild(Content) content: Content;

  constructor(public navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private ferApi: FeritualApiProvider,
    private profileApi: UserprofileApiProvider,
    private toastCtrl: ToastController,
    private recommendApi: RecommendationApiProvider,
    //private browser: InAppBrowser,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.refresh(null);
  }

  async refresh($event : any) {
    let toast = this.toastCtrl.create({
      message: 'Loading recommendations',
      position: 'top'
    });
    toast.present();

    try {
      this.profile = await this.profileApi.loadUserProfile();
      this.recommendations = await this.recommendApi.getRecipeRecommendationsAsync(this.profile);
    }
    catch(err) {
      console.log(err);
      this.presentAlert("Error", "An unexpected error occured in loading recommendations and refreshing data. Please try again in a few moments.");
    }
    finally {
      toast.dismiss();
    }
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


}
