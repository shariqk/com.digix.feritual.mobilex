
export class FxLocationType {
  public static provider_type_nx = 'nx';
  public static provider_type_es = 'es';

}

export class FxLocation {
  public id : string;
  public name : string;
  public lat : number;
  public lng : number;
  public type : string;
  public distance : number;
  public logoUrl : string;
  public description : string;
}

export class FxLocationMenu {
  public location : FxLocation;
  public items : FxLocationMenuItem[];
}

export class FxLocationMenuItem {
  public name : string;
  public description : string;
  public calories : number;
  public photoUrl : string;
}
