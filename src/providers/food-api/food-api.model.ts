

export class FoodSearchResult {
  public branded : FoodItem[];
  public self : FoodItem[];
  public common : FoodItem[];

  public items() : FoodItem[] {
    var list :FoodItem[] = [];
    if(this.branded!=null) { list = list.concat(this.branded); }
    if(this.common!=null) { list = list.concat(this.common); }
    if(this.self!=null) { list = list.concat(this.self); }

    return list;
  }
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

  public id : string;
  public lat : number;
  public lng : number;

  public distance_km : number;
  public distance : number;
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

export interface NuitrientSearchResult {
    foods: Food[];
}

export interface Food {
    food_name:             string;
    brand_name:            null;
    serving_qty:           number;
    serving_unit:          string;
    serving_weight_grams:  number;
    nf_calories:           number;
    nf_total_fat:          number;
    nf_saturated_fat:      number;
    nf_cholesterol:        number;
    nf_sodium:             number;
    nf_total_carbohydrate: number;
    nf_dietary_fiber:      number;
    nf_sugars:             number;
    nf_protein:            number;
    nf_potassium:          number;
    nf_p:                  number;
    full_nutrients:        FullNutrient[];
    nix_brand_name:        null;
    nix_brand_id:          null;
    nix_item_name:         null;
    nix_item_id:           null;
    upc:                   null;
    consumed_at:           string;
    metadata:              Metadata;
    source:                number;
    ndb_no:                number;
    tags:                  Tags;
    alt_measures:          AltMeasure[];
    lat:                   null;
    lng:                   null;
    meal_type:             number;
    photo:                 Photo;
    sub_recipe:            null;
}

export interface AltMeasure {
    serving_weight: number;
    measure:        string;
    seq:            number | null;
    qty:            number;
}

export interface FullNutrient {
    attr_id: number;
    value:   number;
}

export interface Metadata {
    is_raw_food: boolean;
}

export interface Photo {
    thumb:            string;
    highres:          string;
    is_user_uploaded: boolean;
}

export interface Tags {
    item:       string;
    measure:    null;
    quantity:   string;
    food_group: number;
    tag_id:     number;
}
