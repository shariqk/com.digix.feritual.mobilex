export interface PlaceAddress {
  results : PlaceAddressResult[];
  status : string;
}

export interface PlaceAddressResult {
  formatted_address : string;
  place_id : string;
  types : string[];
}

export class GoogleLocation {
  public lat : number;
  public lng : number;
  public address : string;

}


export interface LatLngSearchResult {
    results: Result[];
    status:  string;
}

export interface Result {
    address_components: AddressComponent[];
    formatted_address:  string;
    geometry:           Geometry;
    place_id:           string;
    types:              string[];
}

export interface AddressComponent {
    long_name:  string;
    short_name: string;
    types:      string[];
}

export interface Geometry {
    location:      Location;
    location_type: string;
    viewport:      Viewport;
}

export interface Location {
    lat: number;
    lng: number;
}

export interface Viewport {
    northeast: Location;
    southwest: Location;
}


export interface AutocompleteResult {
  predictions : AutocompletePrediction[];
  status : string;
}

export interface AutocompletePrediction {
  description : string;
  id : string;
  place_id : string;
  types : string[];
}
