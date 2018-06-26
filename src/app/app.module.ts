import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Geolocation } from '@ionic-native/geolocation';
import { IonicStorageModule } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { FoodPage } from '../pages/food/food';
import { ProfilePage } from '../pages/profile/profile';
import { AnalyzePage } from '../pages/analyze/analyze';
import { TabsPage } from '../pages/tabs/tabs';
import { FoodListComponent } from '../components/food-list/food-list';
import { AddressPickerPage } from '../pages/address-picker/address-picker';
import { LocationMenuPage } from '../pages/location-menu/location-menu';
import { RecipesPage } from '../pages/recipes/recipes';
import { RecipeDetailPage } from '../pages/recipe-detail/recipe-detail';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FoodApiProvider } from '../providers/food-api/food-api';
import { EatstreetApiProvider } from '../providers/eatstreet-api/eatstreet-api';
import { MsvisionApiProvider } from '../providers/msvision-api/msvision-api';
import { GoogleApiProvider } from '../providers/google-api/google-api';
import { FeritualApiProvider } from '../providers/feritual-api/feritual-api';
import { UserprofileApiProvider } from '../providers/userprofile-api/userprofile-api';
import { FitbitApiProvider } from '../providers/fitbit-api/fitbit-api';

@NgModule({
  declarations: [
    MyApp,
    FoodPage,
    ProfilePage,
    AnalyzePage,
    TabsPage,
    AddressPickerPage,
    LocationMenuPage,
    RecipesPage,
    RecipeDetailPage,
    FoodListComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot({
      name: '__com_digix_feritual_mobileX',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    })

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    FoodPage,
    ProfilePage,
    AnalyzePage,
    TabsPage,
    AddressPickerPage,
    RecipesPage,
    RecipeDetailPage,
    LocationMenuPage,
    FoodListComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    FoodApiProvider,
    Camera,
    InAppBrowser,
    Geolocation,
    EatstreetApiProvider,
    MsvisionApiProvider,
    GoogleApiProvider,
    FeritualApiProvider,
    UserprofileApiProvider,
    FitbitApiProvider
  ]
})
export class AppModule {}
