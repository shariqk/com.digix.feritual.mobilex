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
    console.log('Hello MsvisionApiProvider Provider');
  }

  public analyze(base64Image : string) : Observable<MSVisionApiResult> {
    var url = 'https://eastus.api.cognitive.microsoft.com/vision/v1.0/analyze?visualFeatures=Categories,Tags,Description&language=en';



  }



  public getRequestHeaders() : HttpHeaders {
    var headers = new HttpHeaders();
    headers = headers
      .set('Ocp-Apim-Subscription-Key', this.subcriptionKey)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    return headers;
  }
}
