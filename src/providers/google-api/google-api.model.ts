export interface PlaceAddress {
  results : PlaceAddressResult[];
}

export interface PlaceAddressResult {
  formatted_address : string;
  place_id : string;
  types : string[];
}
