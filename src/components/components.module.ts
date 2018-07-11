import { NgModule } from '@angular/core';
import { FoodListComponent } from './food-list/food-list';
import { RecommendedFoodComponent } from './recommended-food/recommended-food';
@NgModule({
	declarations: [FoodListComponent,
    RecommendedFoodComponent],
	imports: [],
	exports: [FoodListComponent,
    RecommendedFoodComponent]
})
export class ComponentsModule {}
