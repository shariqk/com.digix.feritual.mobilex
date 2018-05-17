import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { FoodPage } from '../pages/food/food';
import { ProfilePage } from '../pages/profile/profile';
import { AnalyzePage } from '../pages/analyze/analyze';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FoodApiProvider } from '../providers/food-api/food-api';

@NgModule({
  declarations: [
    MyApp,
    FoodPage,
    ProfilePage,
    AnalyzePage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    FoodPage,
    ProfilePage,
    AnalyzePage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    FoodApiProvider
  ]
})
export class AppModule {}
