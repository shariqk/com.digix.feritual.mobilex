
export class UserProfileHelper {
  public static addRecentAddress = function(profile : UserProfile, address : string) : boolean {
    if(address!=null && address.length>0 && UserProfileHelper.indexOfItem(profile.recentAddressList, address)<0) {
      profile.recentAddressList.push(address);
      return true;
    }
  }

  public static addFoodSearch(profile : UserProfile, searchTerm : string) : boolean {
    if(searchTerm!=null && searchTerm.length>0 && UserProfileHelper.indexOfItem(profile.foodSearches, searchTerm)<0) {
      profile.foodSearches.push(searchTerm);
      return true;
    }
  }

  public static addRecipeSearch(profile : UserProfile, searchTerm : string) : boolean {
    if(searchTerm!=null && searchTerm.length>0 && UserProfileHelper.indexOfItem(profile.recipeSearches, searchTerm)<0) {
      profile.recipeSearches.push(searchTerm);
      return true;
    }
  }

  private static indexOfItem(list : string[], item : string) {
    if(item == null) { return -1; }
    item = item.toLowerCase();
    let pos = list.findIndex(str => str.toLowerCase() === item);
    return pos;
  }


  public static validate(p : UserProfile) : UserProfile {
    if(p.avoids==null) { p.avoids = [] }
    if(p.recentAddressList==null) { p.recentAddressList = [] }
    if(p.favoriteRecipes==null) { p.favoriteRecipes = [] }
    if(p.diets == null) { p.diets = [] }
    if(p.cuisines == null) { p.cuisines = [] }
    if(p.recipeSearches == null) { p.recipeSearches = [] }
    if(p.foodSearches == null) { p.foodSearches = [] }
    if(p.foodFilters==null) { p.foodFilters = new FoodFilters() }

    return p;
  }


}

export class UserProfile {
  public name : string;
  public email : string;
  public id : string;

  public avoids : string[] = [];
  public cuisines : string[] = [];
  public recentAddressList : string[] = [];
  public diets : string[] = [];
  public favoriteRecipes : string[] = [];

  public recipeSearches : string[] = [];
  public foodSearches : string[] = [];

  public foodFilters: FoodFilters;
}

export class FoodFilters {
  public items: FoodFilterItem[] = [
    { title: 'Low Fat', selected: false },
    { title: 'Low Sodium', selected: false },
    { title: 'Low Sugar', selected: false },
    { title: 'Low Carb', selected: false },
    { title: 'Low Calories', selected: false },
    { title: 'High Protein', selected: false },
    { title: 'Gluten Free', selected: false },
  ];
}

export interface FoodFilterItem {
  title : string;
  selected : boolean;
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

/*



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
*/
