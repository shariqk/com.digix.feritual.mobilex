import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Camera, CameraOptions } from '@ionic-native/camera';


@IonicPage()
@Component({
  selector: 'page-analyze',
  templateUrl: 'analyze.html',
  providers: [[Camera]]

})
export class AnalyzePage {

  base64Image : string = null;

  constructor(public navCtrl: NavController, public navParams: NavParams, public camera : Camera) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AnalyzePage');
  }

  takeAndDisplayImage() {
    this.takePicture()
      .then(image => this.base64Image = image)
      .catch(err => alert(JSON.stringify(err)));
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
        quality: 100,
        destinationType: ctx.camera.DestinationType.DATA_URL,
        encodingType: ctx.camera.EncodingType.JPEG,
        mediaType: ctx.camera.MediaType.PICTURE
      }

      //console.log('camera', ctx.camera);

      ctx.camera.getPicture(options).then((imageData) => {
         // imageData is either a base64 encoded string or a file URI
         // If it's base64:
         let base64Image = 'data:image/jpeg;base64,' + imageData;
         resolve(base64Image)
        },
        (err) => {
          console.log(err);
          reject(err);
        });
      });
  }
}
