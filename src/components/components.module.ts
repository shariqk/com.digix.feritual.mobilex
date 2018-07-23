import { NgModule } from '@angular/core';
import { FoodListComponent } from './food-list/food-list';
import { RecommendedFoodComponent } from './recommended-food/recommended-food';
import { RecommendedLocationComponent } from './recommended-location/recommended-location';
import { LocationListComponent } from './location-list/location-list';
@NgModule({
	declarations: [FoodListComponent,
    RecommendedFoodComponent,
    RecommendedLocationComponent,
    LocationListComponent],
	imports: [],
	exports: [FoodListComponent,
    RecommendedFoodComponent,
    RecommendedLocationComponent,
    LocationListComponent]
})
export class ComponentsModule {}
