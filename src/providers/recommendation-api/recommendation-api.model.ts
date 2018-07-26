import { FxLocation, FxLocationMenuItem, Recipe } from '../feritual-api/feritual-api.model';
import { UserProfile } from '../userprofile-api/userprofile.model';
import { GoogleLocation } from '../google-api/google-api.model';

export class Recommendations {
  private static _instance : Recommendations = null;
  public static get instance() : Recommendations
  {
    return Recommendations._instance;
  }
  public static set instance(val : Recommendations)
  {
    Recommendations._instance = val;
    console.log(Recommendations.realoadEvents);
    for(let e of Recommendations.realoadEvents) {
      e.callBack(val);
    }
  }

  //public refreshCallback: (name: Recommendations) => void;

  //public callback:{(param:string): void;}[] = [];

  //public profile : UserProfile = null;

  private static realoadEvents : any[] = [];
  public static onReload(name: string, callBack: any) {
    for(let e of Recommendations.realoadEvents) {
      if(e.name==name) {
        return;
      }
    }

    Recommendations.realoadEvents.push({
      name: name,
      callBack: callBack
    });
    console.log('callback added', Recommendations.realoadEvents);
  }

  public static onReloadRemove(name: string) {
    for(let i=0; i<Recommendations.realoadEvents.length; i++) {
      if(Recommendations.realoadEvents[i].name==name) {
        Recommendations.realoadEvents.splice(i,1);
      }
    }
    console.log('callback removed', Recommendations.realoadEvents);
  }

  public locations : FxLocation[];

  public items : RecommendationGroup[];
  public currentLocation : GoogleLocation;
  public lat : number;
  public lng : number;
}

export class RecommendationGroup
{
  public title : string;
  public keywords : string[];

  public locations : FxLocation[];
  public menuItems : FxLocationMenuItem[];
  public recipes : Recipe[];
}
