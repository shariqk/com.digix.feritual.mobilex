import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { GoogleMaps, GoogleMap, CameraPosition, LatLng, GoogleMapsEvent } from '@ionic-native/google-maps';

//import { PlaceAddress, GoogleLocation } from '../../providers/google-api/google-api.model';
import { FxLocation } from '../../providers/feritual-api/feritual-api.model';

declare var google;

export enum GoogleMapZoomLevel {
  world = 1,
  continent = 5,
  city = 10,
  streets = 15,
  buildings = 20
}


@Component({
  selector: 'eat-out-map',
  templateUrl: 'eat-out-map.html'
})
export class EatOutMapComponent implements AfterViewInit {
  @ViewChild('map') mapElement: ElementRef;

  private map: any;
  private markers: any = [];

  private zoom_level = GoogleMapZoomLevel.city + 2;
  //private street_zoom_level = 15;
  private default_marker_pin = this.pinSymbol("#f4f4f4");
  private highlight_marker_pin = null;// this.pinSymbol("#488aff");
  private current_location_pin = "https://www.robotwoods.com/dev/misc/bluecircle.png";
  private highlightedMarker = null;
  private using_map_plugIn = true;

  private _locations: FxLocation[];

  public markerSelectedCallBack: any;


  constructor() {
  }

  private get locations(): FxLocation[] {
    return this._locations;
  }
  private set locations(value: FxLocation[]) {
    this._locations = value;
  }

  ngAfterViewInit() {

  }

  public GetMapCenter(): LatLng {
    if(this.using_map_plugIn) {
      let pos = this.map.getCenter();
      return new LatLng(pos.lat(), pos.lng());
    }
    else {
      let pos = this.map.getBounds().getCenter();
      return new LatLng(pos.lat(), pos.lng());
    }
  }

  public async CenterMapTo(lat: number, lng: number) {
    this.map.setZoom(this.zoom_level);
    let pos = new LatLng(lat, lng);
    this.map.panTo(pos);
    this.map.setCenter(pos);


    //

  }

  public async MarkLocations(locations: FxLocation[]) {
    this.locations = locations;
    this.buildMapMarkers();
  }

  public async SelectLocation(locationId: string) {
    for(let m of this.markers) {
      if(m.locationId==locationId) {
        if(this.highlightedMarker==m) {
          break;
        }

        if(this.highlightedMarker!=null) {
          this.highlightedMarker.setIcon(this.default_marker_pin);
          this.highlightedMarker.zIndex = google.maps.Marker.MAX_ZINDEX + 1;
        }

        m.setIcon(this.highlight_marker_pin);
        m.map.panTo(m.getPosition());
        m.zIndex = google.maps.Marker.MAX_ZINDEX + 2;
        this.highlightedMarker = m;

        this.setDefaultMarkerIcon(locationId);

        break;
      }
    }

  }

  private async clearLocations() {
    if(this.markers!=null)
    {
      for(let m of this.markers)
      {
        m.setMap(null);
      }
    }
    this.highlightedMarker = null;
  }

  async buildMapMarkers() {
    this.clearLocations();

    this.markers = [];

    // current location
    let centerPos = this.GetMapCenter();
    let marker = new google.maps.Marker({
      position: centerPos,
      //animation: google.maps.Animation.DROP,
      map: this.map,
      icon: this.current_location_pin,
      zIndex: google.maps.Marker.MAX_ZINDEX + 1,
    });
    this.markers.push(marker);

    for(let p of this.locations)
    {
      let pos = new LatLng(p.lat, p.lng);

      let marker = new google.maps.Marker({
        position: pos,
        //animation: google.maps.Animation.DROP,
        map: this.map,
        icon: this.default_marker_pin, // 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
        title: p.name,
        zIndex: google.maps.Marker.MAX_ZINDEX + 1,
        locationId: p.id,
        //label: (this.markers.length+1).toString(),
      });

      this.markers.push(marker);

      //let infowindow = new google.maps.InfoWindow({
      //    content: '<b>'+p.name+'</b>'
      //  });

      let ctx = this;
      marker.addListener('click', function() {
        ctx.map.panTo(marker.getPosition());
        marker.setIcon(ctx.highlight_marker_pin);
        ctx.setDefaultMarkerIcon(marker.locationId);

        if(ctx.markerSelectedCallBack!=null) {
          ctx.markerSelectedCallBack(p.id);
        }

      });

    }
  }

  public async Initialize(lat: number, lng: number) {
    if(this.map==null)
    {
      if(lat==null || lng==null)
      {
        lat = 40.759011;
        lng = -73.984472;
      }

      let pos = new LatLng(lat, lng);
      let options = {
        zoom: GoogleMapZoomLevel.continent,
        tilt: 10,
        center: pos,
        fullscreenControl: false
      };

      this.map = GoogleMaps.create(this.mapElement.nativeElement, options);

      //console.log(this.map);
      let m : any = this.map;
      if(m.zoom==null)
      {
        this.map = new google.maps.Map(this.mapElement.nativeElement, options);
        this.using_map_plugIn = false;
      }
    }
  }

  async setDefaultMarkerIcon(selectedLocId: string) {
    if(selectedLocId!=null) {
      for(let m of this.markers) {
        if(m.locationId!=selectedLocId) {
          m.setIcon(this.default_marker_pin);
        }
      }
    }
  }

  private pinSymbol(color: string) {
    return {
        path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0',
        fillColor: color,
        fillOpacity: 1,
        strokeColor: '#000',
        strokeWeight: 2,
        scale: 1,
      };
  }

}
