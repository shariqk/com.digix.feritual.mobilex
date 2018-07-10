import { FxLocation, FxLocationMenuItem, Recipe } from '../feritual-api/feritual-api.model';


export class Recommendations {
  public static instance : Recommendations = null;

  public items : RecommendationGroup[];
}

export class RecommendationGroup
{
  public title : string;
  public keywords : string[];

  public locations : FxLocation[];
  public menuItems : FxLocationMenuItem[];
  public recipes : Recipe[];
}
