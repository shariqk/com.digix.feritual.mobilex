
export class UserProfile {
  public name : string;
  public email : string;
  public id : string;

  //public allergies = new UserProfileAllergies();
  //public cuisine = new CuisinePreferences();

  public avoids : string[] = [];
  public cuisines : string[] = [];
  public recentAddressList : string[] = [];
  public diets : string[] = [];
  public favoriteRecipes : string[] = [];

  public static validate(p : UserProfile) : UserProfile {
    if(p.avoids==null) { p.avoids = [] }
    if(p.recentAddressList==null) { p.recentAddressList = [] }
    if(p.favoriteRecipes==null) { p.favoriteRecipes = [] }
    if(p.diets == null) { p.diets = [] }
    if(p.cuisines == null) { p.cuisines = [] }

    return p;
  }
}

export interface UserProfileOptions {
    cuisines: string[];
    avoids:   string[];
    diets:    string[];
}


export interface KeyValueItem {
 key : string;
 value : boolean;
}





export class UserProfileAllergies {
  Items : KeyValueItem[] = [];

  constructor() {
    for(let key of UserProfileAllergies.keys) {
      this.Items.push({
        key: key,
        value: false
      });
    }

    //console.log(this);
    return this;
  }

  public static keys : string[] = [
    'milk',
    'eggs',
    'fish',
    'shellfish',
    'treenuts',
    'peanuts',
    'wheat',
    'soybeans',
    'gluten'
  ];

  /*
  public set(key: string, value : boolean)
  {
    var item = this._get(key);
    if(item==null) {
      this.items.push({
        key: key,
        value: value
      });
    }
    else {
      item.value = value;
    }
  }

  public get(key: string) : boolean
  {
    var item = this._get(key);
    return item == null ? false : item.value;
  }

  _get(key: string) : KeyValueItem {
    for(let item of this.items) {
      if(item.key == key) {
        return item;
      }
    }
    return null;
  }

  milk : boolean = false;
  eggs : boolean = false;
  fish : boolean = false;
  shellfish : boolean = false;
  treenuts : boolean = false;
  peanuts : boolean = false;
  wheat  : boolean = false;
  soybeans : boolean = false;
  gluten : boolean = false;
  */
}

export class CuisinePreferences {
  Items : KeyValueItem[] = [];

  constructor() {
    for(let key of CuisinePreferences.keys) {
      this.Items.push({
        key: key,
        value: false
      });
    }

    //console.log(this);
    //return this;
  }

  public static keys : string[] = [
    'italian',
    'chinese',
    'pizza',
    'indian',
    'sushi',
    'mediterranean',
    'american',
    'french',
    'thai'
  ];


}
