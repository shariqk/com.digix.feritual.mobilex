import { NgModule } from '@angular/core';
import { FoodListComponent } from './food-list/food-list';
import { RecommendedFoodComponent } from './recommended-food/recommended-food';
import { RecommendedLocationComponent } from './recommended-location/recommended-location';
import { LocationListComponent } from './location-list/location-list';
import { EatOutVerticalStripComponent } from './eat-out-vertical-strip/eat-out-vertical-strip';

@NgModule({
	declarations: [FoodListComponent,
    RecommendedFoodComponent,
    RecommendedLocationComponent,
    LocationListComponent,
    EatOutVerticalStripComponent,
    ],
	imports: [],
	exports: [FoodListComponent,
    RecommendedFoodComponent,
    RecommendedLocationComponent,
    LocationListComponent,
    EatOutVerticalStripComponent,
    ]
})
export class ComponentsModule {}
