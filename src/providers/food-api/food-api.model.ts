

export class FoodSearchResult {
  public branded : FoodItem[];
  public self : FoodItem[];
  public common : FoodItem[];
}

export class FoodItem {
  public food_name : string;
  public photo : FoodPhoto;
  public full_nutrients : FoodNutrient[];

  public image : string;
  public serving_unit : string;
  public nix_brand_id : string;
  public brand_name_item_name : string;
  public serving_qty : number;
  public nf_calories : number;
  public brand_name : string;
  public brand_type : number;
  public nix_item_id : string;
  public serving_weight_grams : number;
  public locale : string;
  public tag_id : number;
}

export class FoodPhoto {
  public  thumb : string;
  public  highres : boolean;
  public  is_user_uploaded : boolean;
}

export class FoodNutrient {
  public value : number;
  public  attr_id : number;
}

export class LocationSearchResult {
  public locations : FoodLocation[]
}

export class FoodLocation
{
  public name : string;
  public brand_id : string;
  public fs_id  : string;
  public address : string;
  public address2  : string;
  public city : string;
  public state : string;
  public country : string;
  public zip : number;
  public website : string;
  public phone : string;
  public guide : string;

  //public string[] guide { get; set; }
  public id : string;
  public lat : number;
  public lng : number;

  public distance_km : number;
  public distance : number;

  //public LocationMenu[] hits { get; set; }
}

export class FoodLocationMenu
{
  public hits : FoodLocationMenuItem[];
}

export class FoodLocationMenuItem {
  public _index : string;
  public _type : string;
  public _id : string;
  public _score : string;

  public  fields : LocationMenuItemFields;
}


export class LocationMenuItemFields {
  public item_id : string;
  public item_name : string;
  public item_description: string;
  public brand_name: string;
  public nf_calcium_dv : number;
  public nf_calories : number;
  public nf_calories_from_fat : number;
  public nf_cholesterol : number;
  public nf_dietary_fiber : number;
  public nf_ingredient_statement : string;
  public nf_iron_dv : number;
  public nf_monounsaturated_fat : number;
  public nf_polyunsaturated_fat  : number;
  public nf_protein : number;
  public nf_refuse_pct : number;
  public nf_saturated_fat : number;
  public nf_serving_size_qty : number;
  public nf_serving_size_unit : number;
  public nf_serving_weight_grams : number;
  public nf_servings_per_container : number;
  public nf_sodium : number;
  public nf_sugars : number;
  public nf_total_carbohydrate : number;
  public nf_total_fat : number;
  public nf_trans_fatty_acid : number;
  public nf_vitamin_a_dv : number;
  public nf_vitamin_c_dv : number;
  public nf_water_grams : number;

  public allergen_contains_milk : boolean;
  public allergen_contains_soybeans : boolean;
  public allergen_contains_wheat : boolean;
  public allergen_contains_eggs : boolean;
  public allergen_contains_shellfish : boolean;
  public allergen_contains_fish : boolean;
  public allergen_contains_tree_nuts : boolean;
  public allergen_contains_peanuts : boolean;
  public allergen_contains_gluten : boolean;
}
