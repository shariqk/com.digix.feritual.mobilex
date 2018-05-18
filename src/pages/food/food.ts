import { Component, Injector, ViewChild, ViewContainerRef,
  ComponentFactoryResolver, EmbeddedViewRef, ApplicationRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

import { FoodApiProvider } from '../../providers/food-api/food-api';
import { FoodListComponent } from '../../components/food-list/food-list'
import { LocationSearchResult, FoodLocation } from '../../providers/food-api/food-api.model';

@IonicPage()
@Component({
  selector: 'page-food',
  templateUrl: 'food.html',
})
export class FoodPage {
  @ViewChild('menucontainer', {read: ViewContainerRef}) menucontainer: ViewContainerRef;

  nearme : LocationSearchResult;
  searchTerm : string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector,
    public api : FoodApiProvider) {
  }

  ionViewDidLoad() {
    if(this.nearme == null) {
      this.getLocations();
    }
  }

  doSearch(event : any) {
    if(this.nearme==null || this.searchTerm==null || this.searchTerm.length<4) {
      return;
    }

    var brands = new Array();
    for(var l of this.nearme.locations) {
      brands.push(l.brand_id);
    }

    this.api.searchForFood(brands, this.searchTerm)
      .subscribe(data => {
        console.log('results', data);
        //alert('success');
      },
      error =>
      {
        alert(error.message);
        console.log(error);
      });
    }

  doLocationMenuSearch(event : any) {
    if(this.nearme==null || this.searchTerm==null || this.searchTerm.length<4) {
        return;
    }

    let ctx = new LoaderContext(this.nearme.locations, this.searchTerm);
    this.getNextLocationMenuAsync(ctx);
  }

  getNextLocationMenuAsync(ctx : LoaderContext) {
    let loc = ctx.next();
    if(loc == null) {
      return;
    }


    this.api.searchLocationMenu([loc.brand_id], ctx.searchTerm)
      .subscribe(menu => {
        //console.log('menu', menu);
        //console.log('loc: ' + loc.name + ' menu.hits: ' + menu.hits.length);

        if(menu.hits.length>0) {
          const c = this.componentFactoryResolver.resolveComponentFactory(FoodListComponent);
          let f = this.menucontainer.createComponent(c);
          f.instance.initialize(loc, menu);
        }
        this.getNextLocationMenuAsync(ctx);

      },
      error =>
      {
        alert(error.message);
        console.log(error);
      });

      //counter++;
    }


  doLocationMenuSearch2(event : any) {
    if(this.nearme==null || this.searchTerm==null || this.searchTerm.length<4) {
      return;
    }

    var counter=0;
    var me = this;
    for(var loc of this.nearme.locations) {
      console.log(loc);
      if(counter>4) { break; }

      this.api.searchLocationMenu([loc.brand_id], this.searchTerm)
        .subscribe(data => {
          //console.log('results', data);

          const c = this.componentFactoryResolver.resolveComponentFactory(FoodListComponent);
          let f = this.menucontainer.createComponent(c);
          //console.log(f);
          //var f : any = c.componentType;
          f.instance.initialize(loc, null);


          //this.addcomponent(me.nearme.locations[counter]);
          //alert('success');
        },
        error =>
        {
          alert(error.message);
          console.log(error);
        });

        counter++;
      }

    }

    /*
    addcomponent(loc: Location)
    {
      const c = this.componentFactoryResolver.resolveComponentFactory(FoodListComponent);
      let f = this.menucontainer.createComponent(c);
      //console.log(f);
      //var f : any = c.componentType;
      f.instance.initialize(loc);
    }

    appendComponentToBody(component: any) {
      // 1. Create a component reference from the component
      const componentRef = this.componentFactoryResolver
        .resolveComponentFactory(component)
        .create(this.injector);

      // 2. Attach component to the appRef so that it's inside the ng component tree
      this.appRef.attachView(componentRef.hostView);

      // 3. Get DOM element from component
      const domElem = (componentRef.hostView as EmbeddedViewRef<any>)
        .rootNodes[0] as HTMLElement;

      // 4. Append DOM element to the body
      document.body.appendChild(domElem);

      // 5. Wait some time and remove it from the component tree and from the DOM
      setTimeout(() => {
          this.appRef.detachView(componentRef.hostView);
          componentRef.destroy();
      }, 3000);
    }

*/

  getLocations() {
    var lat = 40.034804;
    var lng = -75.301198;
    let toast = this.toastCtrl.create({
        message: 'Loading locations near you',
        position: 'top'
      });
    toast.present();

    this.api.getLocations(lat, lng)
      .subscribe(data => {
        this.nearme = data;
        //console.log('locations', data);
        toast.dismiss();
      },
      error =>
      {
        toast.dismiss();
        alert(error.message);
        console.log(error);
      });
    }
}


export class LoaderContext {
  constructor(locations : FoodLocation[], searchTerm : string) {
    this.locations = locations;
    this.searchTerm = searchTerm;
    this.counter = -1;
    this.processed = [];
  }


  public next() : FoodLocation {
    while(this.counter<this.locations.length-1) {
      this.counter++;
      if(this.counter > 5) {
        return null;
      }
      else {
        var skip = false;
        var loc = this.locations[this.counter];
        //console.log('processed', this.processed);
        for(var b in this.processed) {
          if(b==loc.name) {
            console.log('skipping ' + loc.name);
            skip = true;
            break;
          }
        }

        if(!skip) {
          this.processed.push(loc.name);
          return this.locations[this.counter];
        }
      }
    }

    return null;

  }

  processed : string[];
  counter : number = -1;
  locations : FoodLocation[] = null;
  public searchTerm : string;
}
