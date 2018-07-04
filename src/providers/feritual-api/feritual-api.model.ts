
//export class FxLocationType {
//  public static provider_type_nx = 'nx';
//  public static provider_type_es = 'es';
//
//}

export class Recommendations {
  public static instance : Recommendations = null;

}

export class RecommendationGroup
{
  public title : string;

  public locations : FxLocation[];
  public menuItems : FxLocationMenuItem[];
  public recipes : Recipe[];
}

export class FxLocation {
  public id : string;
  public name : string;
  public lat : number;
  public lng : number;
  public provider : string;
  public distance : number;
  public logoUrl : string;
  public description : string;

  public foodTypes : string[];

  public street : string;
  public city : string;
  public zip : string;
  public state : string;
}

export class FxIcons {
  public static getIcon(name : string) {
    name = name.toLowerCase().trim();
    for(var i of FxIcons.Icons) {
      if(i.key==name) {
        return i.url;
      }
    }
    return FxIcons.generic_icon_url;
  }

  public static generic_icon_url = 'https://www.shareicon.net/data/256x256/2017/06/21/887479_heart_512x512.png';

  // images: https://www.nutritionix.com/brands/restaurant
  public static Icons = [

    {
      key: "saladworks",
      url: 'https://d1r9wva3zcpswd.cloudfront.net/533d7e2b5b8015402e5ce1ed.jpg'
    },
    {
      key: "wendy's",
      url: 'https://d1r9wva3zcpswd.cloudfront.net/57b22004280014294b55b0b6.jpg'
    },
    {
      key: "qdoba",
      url: 'https://d1r9wva3zcpswd.cloudfront.net/533d7bd75b8015402e5ce07d.jpg'
    },
    {
      key: "domino's",
      url: 'https://d1r9wva3zcpswd.cloudfront.net/533d7b895b8015402e5ce04f.jpg'
    },
    {
      key: "rita's ice",
      url: 'https://d1r9wva3zcpswd.cloudfront.net/533d7caa5b8015402e5ce0fd.jpg'
    },
    {
      key: "bertucci's",
      url: 'https://d1r9wva3zcpswd.cloudfront.net/533d7beb5b8015402e5ce08b.jpg'
    },
    {
      key: "zoe's kitchen",
      url: 'https://d1r9wva3zcpswd.cloudfront.net/598c70e61c72fb1d243f33df.jpg'
    },
    {
      key: 'sweetgreen',
      url: 'https://d1r9wva3zcpswd.cloudfront.net/533d7bf6bf66c42a2eec2ac4.jpg'
    },
    {
      key: "not your average joe's",
      url: 'https://d1r9wva3zcpswd.cloudfront.net/533d7e7dbf66c42a2eec2c5e.jpg'
    },
    {
      key: 'starbucks',
      url: 'https://d1r9wva3zcpswd.cloudfront.net/533d7bb2bf66c42a2eec2aa0.png'
    },
    {
      key: "ruby's diner",
      url: 'https://d1r9wva3zcpswd.cloudfront.net/533d7f145b8015402e5ce25d.jpg'
    },
    {
      key: 'philly pretzel factory',
      url: 'https://d1r9wva3zcpswd.cloudfront.net/59e8b2dadeefbfc74642b1a9.jpg'
    },
    {
      key: "dunkin' donuts",
      url: 'https://d1r9wva3zcpswd.cloudfront.net/533d7bb75b8015402e5ce063.jpg'
    },
    {
      key: "mcdonald's",
      url: 'https://d1r9wva3zcpswd.cloudfront.net/533d7bf65b8015402e5ce097.jpg'
    },
    {
      key: "ihop",
      url: 'https://d1r9wva3zcpswd.cloudfront.net/533d7ba75b8015402e5ce059.jpg'
    },
    {
      key: "bruegger's",
      url: 'https://d1r9wva3zcpswd.cloudfront.net/533d7bef5b8015402e5ce091.jpg'
    },
    {
      key: 'panera bread',
      url: 'https://d1r9wva3zcpswd.cloudfront.net/533d7b9e819e81712576a724.png'
    },
    {
      key: 'burger king',
      url: 'https://d1r9wva3zcpswd.cloudfront.net/533d7b92bf66c42a2eec2a94.png'
    },
    {
      key: 'pizza hut',
      url: 'https://d1r9wva3zcpswd.cloudfront.net/533d7b9df787c85e2535e6ac.jpg'
    },
    {
      key: 'kfc',
      url: 'https://d1r9wva3zcpswd.cloudfront.net/533d7bb25b8015402e5ce061.png'
    },
    {
      key: 'dunn bros coffee',
      url: 'https://d1r9wva3zcpswd.cloudfront.net/533d7d32bf66c42a2eec2b8e.png'
    },
    {
      key: "dion's pizza",
      url: 'https://d1r9wva3zcpswd.cloudfront.net/533d7fcebf66c42a2eec2cfe.png'
    },
    {
      key: 'chipotle',
      url: 'https://d1r9wva3zcpswd.cloudfront.net/533d7b89bf66c42a2eec2a8e.png'
    },
    {
      key: 'chickpea',
      url: 'https://d1r9wva3zcpswd.cloudfront.net/533d7c40bf66c42a2eec2aec.png'
    },
    {
      key: 'cafe metro',
      url: 'https://d1r9wva3zcpswd.cloudfront.net/533d7ee55b8015402e5ce23f.png'
    },
    {
      key: 'burgerville',
      url: 'https://d1r9wva3zcpswd.cloudfront.net/565387c1e29fb86b7e902653.jpg'
    },
    {
      key: 'back yard burgers',
      url: 'https://d1r9wva3zcpswd.cloudfront.net/533d7d9dbf66c42a2eec2bd6.png'
    },
    {
      key: 'back yard burgers',
      url: 'https://d1r9wva3zcpswd.cloudfront.net/533d8006bf66c42a2eec2d0a.png'
    },
    {
      key: 'subway',
      url: 'https://d1r9wva3zcpswd.cloudfront.net/533d7b89bf66c42a2eec2a92.png'
    },
    {
      key: 'wawa',
      url: 'https://d1r9wva3zcpswd.cloudfront.net/533d7bdb5b8015402e5ce07f.png'
    },
    {
      key: 'generic',
      url: 'assets/heart-512x512.png'
    }
  ];
}


export class FxLocationMenu {
  public location : FxLocation;
  public locationId : string;
  public provider : string;


  //public items : FxLocationMenuItem[];
  public categories : FxLocationMenuCategory[];
}

export class FxLocationMenuCategory {
  public name : string;
  public items : FxLocationMenuItem[];
}

export class FxLocationMenuItem {
  public name : string;
  public description : string;
  public details : string;
  public calories : number;
  public photoUrl : string;

  public avoid : boolean;
  public avoidReason : string;

  /*
  public allergen_contains_milk : boolean;
  public allergen_contains_soybeans : boolean;
  public allergen_contains_wheat : boolean;
  public allergen_contains_eggs : boolean;
  public allergen_contains_shellfish : boolean;
  public allergen_contains_fish : boolean;
  public allergen_contains_tree_nuts : boolean;
  public allergen_contains_peanuts : boolean;
  public allergen_contains_gluten : boolean;
  */

}



export interface RecipeSearchResult {
    q:     string;
    from:  number;
    to:    number;
    more:  boolean;
    count: number;
    hits:  Hit[];
}

export interface Hit {
    recipe:     Recipe;
    bookmarked: boolean;
    bought:     boolean;
}

export interface Recipe {
    uri:             string;
    label:           string;
    image:           string;
    source:          string;
    url:             string;
    shareAs:         string;
    yield:           number;
    dietLabels:      string[];
    healthLabels:    string[];
    cautions:        any[];
    ingredientLines: string[];
    ingredients:     Ingredient[];
    calories:        number;
    totalWeight:     number;
    totalTime:       number;
    totalNutrients:  { [key: string]: Total };
    totalDaily:      { [key: string]: Total };
    digest:          Digest[];
}

export interface Digest {
    label:        string;
    tag:          string;
    schemaOrgTag: null | string;
    total:        number;
    hasRdi:       boolean;
    daily:        number;
    unit:         string;
    sub:          Digest[] | null;
}

export interface Ingredient {
    text:   string;
    weight: number;
}

export interface Total {
    label:    string;
    quantity: number;
    unit:     string;
}
