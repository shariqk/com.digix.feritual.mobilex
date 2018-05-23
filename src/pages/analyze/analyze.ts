import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

import { Camera, CameraOptions } from '@ionic-native/camera';
import { MsvisionApiProvider } from '../../providers/msvision-api/msvision-api';
import { MSVisionApiResult } from '../../providers/msvision-api/msvision-api.model';
import { FoodApiProvider } from '../../providers/food-api/food-api';

@IonicPage()
@Component({
  selector: 'page-analyze',
  templateUrl: 'analyze.html',
  providers: [[Camera]]

})
export class AnalyzePage {

  base64Image : string = null;
  analysis : MSVisionApiResult = null;


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public nxApi : FoodApiProvider,
    public toastCtrl: ToastController,
    public msvisionApi : MsvisionApiProvider,
    public camera : Camera) {
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad AnalyzePage');
  }

  async testVisionApi() {
    let toast = this.toastCtrl.create({
        message: 'Analyzing image...',
        position: 'top'
      });

    var num = Math.floor(Math.random() * 6);
    if(num<1 || num>6) {
      num = 1;
    }

    //var testImageJson = '{"url":"http://www.caloriemama.ai/img/examples/Image6.jpeg"}';
    var testImageUrl = 'http://www.caloriemama.ai/img/examples/Image' + num + '.jpeg';
    this.base64Image = testImageUrl;

    toast.present();
    try {
      var result = await this.msvisionApi.analyzeImageUrlAsync(testImageUrl);
      this.analysis = result;

      var tags = this.formatTags(result.description.tags);
      var nxInfo = await this.nxApi.getNutrientsAsync(tags);
      console.log(nxInfo);

    }
    catch(err) {
      alert(JSON.stringify(err));
    }
    finally {
      toast.dismiss();
    }

    /*
    this.msvisionApi.analyzeImageUrl(testImageUrl)
      .subscribe(
          result => {
            //alert(JSON.stringify(result));
            this.analysis = result;// JSON.stringify(result);
            toast.dismiss();
          },
          err =>{ alert(JSON.stringify(err)); toast.dismiss(); }
      );
    */
  }

  formatPercentage(num : number) {
    return Math.floor(num * 100) + '%';
  }

  toJSONString(obj : object) {
    return obj!=null ? JSON.stringify(obj) : "";
  }

  formatTags(tags : string[]) : string {
    let str = '';
    for(var t of tags) {
      str += (str.length > 0 ? ', ' : '') + t
    }
    //console.log('tags: ', str);
    return str;
  }

  async takeAndDisplayImage() {
    let imageData = await this.takePicture();
    if(imageData == null) { return; }
    this.base64Image = 'data:image/jpeg;base64,' + imageData;


    let toast = this.toastCtrl.create({
        message: 'Analyzing image...',
        position: 'top'
      });
    toast.present();

    try {
      var result = await this.msvisionApi.analyzeAsync(imageData);
      this.analysis = result;

      var tags = this.formatTags(result.description.tags);
      var nxInfo = await this.nxApi.getNutrientsAsync(tags);
      console.log(nxInfo);

    }
    catch (err) {
      alert(JSON.stringify(err));
    }
    finally {
      toast.dismiss();
    }


  }

  async takeAndDisplayImage2() {
    var ctx = this;
    let toast = this.toastCtrl.create({
        message: 'Analyzing image...',
        position: 'top'
      });
    this.takePicture()
      .then(imageData => {
        this.base64Image = 'data:image/jpeg;base64,' + imageData;

        //var testImageJson = '{"url":"http://www.caloriemama.ai/img/examples/Image6.jpeg"}';
        toast.present();

        this.msvisionApi.analyze(imageData)
          .subscribe(
              result => {
                this.analysis = result;
                toast.dismiss();
              },
              err => {
                alert(JSON.stringify(err));
                toast.dismiss();
              }
          );

      })
      .catch(err => {
        toast.dismiss();
        alert(JSON.stringify(err));
      });
  }


  takePicture() : Promise<string> {
    var ctx = this;
    return new Promise(function(resolve, reject) {

      try {
        if(ctx.camera == null) {
            alert('Camera is not available');
            resolve(null);
        }
      }
      catch (err) {
        alert('Error occured while accessing camera: ' + JSON.stringify(err));
        reject(err);
      }

      const options: CameraOptions = {
        quality: 50,
        destinationType: ctx.camera.DestinationType.DATA_URL,
        encodingType: ctx.camera.EncodingType.JPEG,
        mediaType: ctx.camera.MediaType.PICTURE
      }

      //console.log('camera', ctx.camera);

      ctx.camera.getPicture(options).then((imageData) => {
         resolve(imageData)
        },
        (err) => {
          console.log(err);
          reject(err);
        });
      });
  }
}
