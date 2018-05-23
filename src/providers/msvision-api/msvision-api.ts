import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


import { MSVisionApiResult } from './msvision-api.model';

@Injectable()
export class MsvisionApiProvider {
  subcriptionKey = '919a53351bbb41a4a68a88093e1facce';

  constructor(public http: HttpClient) {
  }

  public analyzeImageUrlAsync(imageUrl : string) : Promise<MSVisionApiResult> {
    var ctx = this;
    return new Promise(function(resolve, reject) {
      ctx.analyzeImageUrl(imageUrl)
        .subscribe(
          result => {
            resolve(result);
          },
          error => reject(error)
        );
    });
  }

  public analyzeImageUrl(imageUrl : string) : Observable<MSVisionApiResult> {
    var url = 'https://eastus.api.cognitive.microsoft.com/vision/v1.0/analyze?visualFeatures=Tags,Categories,Description&language=en';

    var postData = '{"url":"' + imageUrl + '"}';
    //var postData = '{"url":"http://www.caloriemama.ai/img/examples/Image6.jpeg"}';

    var headers = new HttpHeaders();
    headers = headers
      .set('Ocp-Apim-Subscription-Key', this.subcriptionKey)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    var result = this.http.post(url, postData, { headers: headers })
      .map(res => <MSVisionApiResult>res);

    return result;
  }

  public analyzeAsync(query : string) : Promise<MSVisionApiResult> {
    var ctx = this;
    return new Promise(function(resolve, reject) {
      ctx.analyze(query)
        .subscribe(
          result => {
            resolve(result);
          },
          error => reject(error)
        );
    });
  }

  public analyze(base64Image : string) : Observable<MSVisionApiResult> {
    var url = 'https://eastus.api.cognitive.microsoft.com/vision/v1.0/analyze?visualFeatures=Tags,Categories,Description&language=en';

    var headers = new HttpHeaders();
    headers = headers
      .set('Ocp-Apim-Subscription-Key', this.subcriptionKey)
      .set('Content-Type', 'application/octet-stream')
      .set('Accept', 'application/json');

    var blob = this.base64toBlob(base64Image, 'application/octet-stream');

    var result = this.http.post(url, blob, { headers: headers })
      .map(res => <MSVisionApiResult>res);

    return result;


  }

  public base64toBlob(base64Data, contentType) {
      contentType = contentType || '';
      var sliceSize = 1024;
      var byteCharacters = atob(base64Data);
      var bytesLength = byteCharacters.length;
      var slicesCount = Math.ceil(bytesLength / sliceSize);
      var byteArrays = new Array(slicesCount);

      for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
          var begin = sliceIndex * sliceSize;
          var end = Math.min(begin + sliceSize, bytesLength);

          var bytes = new Array(end - begin);
          for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
              bytes[i] = byteCharacters[offset].charCodeAt(0);
          }
          byteArrays[sliceIndex] = new Uint8Array(bytes);
      }
      return new Blob(byteArrays, { type: contentType });
  }


  public getRequestHeaders() : HttpHeaders {
    var headers = new HttpHeaders();
    headers = headers
      .set('Ocp-Apim-Subscription-Key', this.subcriptionKey)
      .set('Content-Type', 'application/octet-stream')
      .set('Accept', 'application/json');

    return headers;
  }
}
