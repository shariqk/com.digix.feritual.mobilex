
export class UserProfile {

  public name : string;
  public email : string;
  public id : string;

  public allergies = new UserProfileAllergies();
  public cuisine = new CuisinePreferences();



}

export class UserProfileAllergies {
   //interface Item {
    //key : string;
    //value : string;
  //}

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

  values = [];
  public set(key: string, value : boolean) {
    for(let i=this.values.length; i>=0; i++) {
      if()
    }

    for(let k of UserProfileAllergies.keys) {

    }
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
  italian : number = 5;
  chinese : number = 5;
  pizza : number = 5;
  indian : number = 5;
  sushi : number = 5;
  mediterranean : number = 5;
  america : number = 5;
  french : number = 5;

}
