import { Injectable } from '@angular/core';
import { Food } from '../shared/models/Food';
import { sample_foods, sample_tags } from 'src/data';
import { Tag } from '../shared/models/Tag';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FoodService {

  constructor() { }

  getAllFoods(): Food[] {
    return sample_foods;
  }

  getAllFoodsBySearchName(searchName: string): Food[] {
    return this.getAllFoods().filter(food => food.name?.toLowerCase().includes(searchName.toLowerCase()));
  }

  getFoodById(foodId: string): any {
    return this.getAllFoods().filter(food => food.id === foodId) ?? new Food();
  }

  getFood(foodId: any): Observable<Food> {
    return of(this.getAllFoods().find(food => food.id === foodId) ?? new Food());
  }

  getAllTags(): Tag[] {
    return sample_tags;
  }
  getAllFoodsByTagName(tagName: string): Food[] {
    return tagName == "All" ?
      this.getAllFoods() :
      this.getAllFoods().filter(food => food.tags?.map(tag => tag.toLowerCase()).includes(tagName.toLowerCase()));

  }


}
