export class FitBitAccessTokenModel
{
  access_token : string;
  expires_in : number;
  refresh_token : string;
  token_type : string;
  user_id : string;
}

export class FitBitActivityModel {
  goals : FitBitGoalModel;
  summary : FitBitSummaryModel;
  activities : FitBitExerciseModel[];
}

export class FitBitSummaryModel {
  activityCalories : number;
  caloriesBMR : number;
  caloriesOut : number;
  elevation : number;
  fairlyActiveMinutes : number;
  floors : number;
  lightlyActiveMinutes : number;
  marginalCalories : number;
  sedentaryMinutes : number;
  steps : number;
  veryActiveMinutes : number;

  distances : FitBitDistancesModel[];
}

export class FitBitExerciseModel {
  activityId : number;
  activityParentId : number;
  calories : number;
  description : string;
  distance : number;
  duration : number;
  hasStartTime : boolean;
  isFavorite : boolean;
  logId : number;
  name : string;
  startTime : string;
  steps : number;
}

export class FitBitDistancesModel {
  activity : string;
  distance : number;
}

export class FitBitGoalModel {
  caloriesOut : number;
  distance : number;
  floors : number;
  steps : number;
}

export class FitBitUserModel {
  aboutMe : string;
  avatar : string;
  displayName : string;
  fullName : string;
  gender : string;

}

export class FitBitProfileModel {
  user : FitBitUserModel;
}
