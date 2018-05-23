
export class FxLocation {
  public id : string;
  public name : string;
  public lat : number;
  public lng : number;
  public type : string;
  public distance : number;
}

export class FxLocationMenu {
  public location : FxLocation;
  public items : FxLocationMenuItem[];
}

export class FxLocationMenuItem {
  public name : string;
  public description : string;
  public calories : number;
}
