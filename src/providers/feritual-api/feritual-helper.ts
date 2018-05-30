import { FxLocation, FxLocationMenu, FxLocationMenuItem } from './feritual-api.model';


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
