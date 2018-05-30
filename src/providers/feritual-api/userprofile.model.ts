
export class UserProfile {

  name : string;
  email : string;
  id : string;

  allergies : UserProfileAllergies = new UserProfileAllergies();
  cuisine : CuisinePreferences = new CuisinePreferences();



}

export class UserProfileAllergies {
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
