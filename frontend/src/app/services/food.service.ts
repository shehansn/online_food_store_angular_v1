import { FOODS_BY_SEARCH_URL, FOODS_BY_TAG_URL, FOOD_BY_ID_URL, FOODS_TAGS_URL } from './../shared/constants/urls';
import { Injectable } from '@angular/core';
import { Food } from '../shared/models/Food';
import { sample_foods, sample_tags } from 'src/data';
import { Tag } from '../shared/models/Tag';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FOODS_URL } from '../shared/constants/urls';

@Injectable({
  providedIn: 'root'
})
export class FoodService {

  constructor(private http: HttpClient) { }

  getAllFoods(): Observable<Food[]> {
    return this.http.get<Food[]>(FOODS_URL);
  }

  getAllFoodsBySearchName(searchName: string): Observable<Food[]> {
    return this.http.get<Food[]>(FOODS_BY_SEARCH_URL + searchName)
  }

  getFoodById(foodId: string): Observable<any> {
    return this.http.get<Food[]>(FOOD_BY_ID_URL + foodId);
  }

  getFood(foodId: any): Observable<Food> {
    return this.http.get<Food>(FOOD_BY_ID_URL + foodId);
  }

  getAllTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(FOODS_TAGS_URL);;
  }

  getAllFoodsByTagName(tagName: string): Observable<Food[]> {
    return tagName == "All" ?
      this.getAllFoods() :
      this.http.get<Food[]>(FOODS_BY_TAG_URL + tagName)

  }


}
