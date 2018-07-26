import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';

import { Storage } from '@ionic/storage';

import { IntroPage } from '../../pages/intro/intro';
import { TabsPage } from '../../pages/tabs/tabs';
import { UserProfile, UserProfileHelper } from '../../providers/userprofile-api/userprofile.model';
import { UserprofileApiProvider } from '../../providers/userprofile-api/userprofile-api';
import { Recommendations } from '../../providers/recommendation-api/recommendation-api.model';
import { RecommendationApiProvider } from '../../providers/recommendation-api/recommendation-api';

@IonicPage()
@Component({
  selector: 'page-start',
  templateUrl: 'start.html',
})
export class StartPage {

  constructor(public navCtrl: NavController,
    private storage: Storage,
    private alertCtrl: AlertController,
    private recommendApi: RecommendationApiProvider,
    private loadingCtrl: LoadingController,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.initialize();


  }

  async initialize() {
    let loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
      //spinner: 'hide',
      //content: "<div class='custom-spinner-container'><div class='custom-spinner-box'></div></div>"
     });
    loading.present();

    try {
      this.storage.get('intro-done').then(done =>
      {
        if (!done)
        {
          //this.storage.set('intro-done', true);
          //this.navCtrl.setRoot(IntroPage);
        }

        this.recommendApi.load(null, null).then(r => {
          this.navCtrl.setRoot(TabsPage);
        });
      });

    }
    catch(err)
    {
      console.log(err);
      loading.dismiss();
      this.presentAlert('Error', 'Something unexpected occured during initialization and start up. Please try again in a few minutes.');
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
