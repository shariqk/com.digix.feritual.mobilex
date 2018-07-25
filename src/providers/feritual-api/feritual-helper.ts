import { FxLocation, FxLocationMenu, FxLocationMenuItem, Recipe } from './feritual-api.model';
import { UserProfile } from '../userprofile-api/userprofile.model';



export class RecipeHelper {
  public static getRecipeId(r : Recipe) {
    let i = r.uri.indexOf("#recipe_") +1;
    return r.uri.substr(i);
  }

  public static isFavoriteRecipe(p : UserProfile, r : Recipe) : boolean
  {
    return (p.favoriteRecipes.indexOf(RecipeHelper.getRecipeId(r))>=0);
  }

  public static setFavoriteRecipe(p : UserProfile, r : Recipe, setFlag : boolean) : boolean
  {
    let id = RecipeHelper.getRecipeId(r);
    console.log('id: ', id, 'setFlag: ', setFlag);
    if(setFlag)
    {
      if(!RecipeHelper.isFavoriteRecipe(p, r)) {
        p.favoriteRecipes.push(id);
        return true;
      }
      else { return false; }
    }
    else if (!setFlag) {
      let i = p.favoriteRecipes.indexOf(id);
      console.log('i: ', i);
      if(i>=0) {
        p.favoriteRecipes.splice(i, 1);
        return true;
      }
      else {
        return false;
      }
    }
  }
}

export class Helper
{
  public static concatStrArray(items : string[]) : string {
    let str = '';
    if(items!=null && items.length>0)
    {
      for(let a of items) {
        str += (str.length>0 ? ', ' : '') + a;
      }
    }
    return str;
  }
}

export class MenuHelper
{
  public static fixMenuItemPhotoUrl(item : FxLocationMenuItem) {
    if(item.photoUrl==null) {
      item.photoUrl = 'assets/images/heart-512x512.png';
    }
  }

  public static fixMenuPhotoUrl(menu : FxLocationMenu) {
    for(var c of menu.categories) {
      for(var item of c.items) {
        MenuHelper.fixMenuItemPhotoUrl(item);

        if(item.calories==-1) {
          item.calories = item.name.length
            + (item.description==null ? 0 : item.description.length)
            + (item.details==null ? 0 : item.details.length);
          item.calories = item.calories * Math.floor(Math.random() * 11);
        }
      }
    }
  }

  public static applyAllergies(menu : FxLocationMenu, profile : UserProfile)
  {
    let allergies = profile.avoids;

    for(var c of menu.categories) {
      for(var item of c.items) {
        let str = item.name + ' ' + item.description + ' ' + item.details;
        str = str.toLowerCase();
        for(let a of profile.avoids) {
          //if(a.value && str.indexOf(a.key)>=0) {
          //  item.allergic = true;
          //}
        }
        MenuHelper.fixMenuItemPhotoUrl(item);
      }
    }
  }

}

export class DistanceCalculator
{

  public calculateDistance(lat : number, lng : number, locations : FxLocation[]) : void {
    for(var loc of locations) {
      loc.distance = this.haversine(loc.lat, loc.lng, lat, lng);
    }
  }

  public sortByDistance(locations : FxLocation[]) : FxLocation[] {
    return locations.sort(function(a, b) {
      if (a.distance == b.distance)
       {
           return 0;
       }
       else if (a.distance > b.distance)
       {
           return 1;
       }
       else
       {
           return -1;
       }
    });

  }

  haversine = function(startLng : number, startLat : number, endLng : number, endLat : number) : number {
    let R : number = 3960; // this.radii.mile;

    let dLat = this.toRad(endLat - startLat);
    let dLon = this.toRad(endLng - startLng);
    let lat1 = this.toRad(startLat);
    let lat2 = this.toRad(endLat);

    let a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  radii = {
    km:    6371,
    mile:  3960,
    meter: 6371000,
    nmi:   3440
  }

  toRad = function(num : number) : number {
      return num * Math.PI / 180
  }


}
