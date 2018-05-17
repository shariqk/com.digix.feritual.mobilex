import { Component } from '@angular/core';


@Component({
  selector: 'food-list',
  templateUrl: 'food-list.html'
})
export class FoodListComponent {

  text: string;

  constructor() {
    console.log('Hello FoodListComponent Component');
    this.text = 'Hello World';
  }

}
