import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';

import { Storage } from '@ionic/storage';

import { IntroPage } from '../../pages/intro/intro';
import { TabsPage } from '../../pages/tabs/tabs';

@IonicPage()
@Component({
  selector: 'page-start',
  templateUrl: 'start.html',
})
export class StartPage {

  constructor(public navCtrl: NavController,
    private storage: Storage,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.initialize();


  }

  async initialize() {
    /*
    let loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
     });
    loading.present();
*/

    try {
      this.storage.get('intro-done').then(done =>
      {
        if (!done)
        {
          //this.storage.set('intro-done', true);
          //this.navCtrl.setRoot(IntroPage);
        }

        this.navCtrl.setRoot(TabsPage);

        //this.recommendApi.load(null, null).then(r => {
        //  this.navCtrl.setRoot(TabsPage);
        //});
      });

    }
    catch(err)
    {
      console.log(err);
      //loading.dismiss();
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
