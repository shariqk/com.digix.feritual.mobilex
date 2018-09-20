import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { GoogleMaps, GoogleMap, CameraPosition, LatLng, GoogleMapsEvent } from '@ionic-native/google-maps';

//import { PlaceAddress, GoogleLocation } from '../../providers/google-api/google-api.model';
import { FxLocation } from '../../providers/feritual-api/feritual-api.model';

declare var google;

@Component({
  selector: 'eat-out-map',
  templateUrl: 'eat-out-map.html'
})
export class EatOutMapComponent implements AfterViewInit {
  @ViewChild('map') mapElement: ElementRef;

  private map: any;
  private markers: any = [];

  private zoom_level = 11;
  private street_zoom_level = 15;
  private default_marker_pin = this.pinSymbol("#f4f4f4");
  private highlight_marker_pin = null;// this.pinSymbol("#488aff");
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

  public async CenterMapTo(lat: number, lng: number) {
    this.map.setZoom(this.zoom_level);
    this.map.panTo(new LatLng(lat, lng));
    this.map.setCenter(new LatLng(lat, lng));
  }

  public async MarkLocations(locations: FxLocation[]) {
    this.locations = locations;
    this.buildMapMarkers();
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
        zoom: this.zoom_level,
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
