import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { FoodService } from 'src/app/services/food.service';
import { Food } from 'src/app/shared/models/Food';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  foods: Food[] = [];
  foodsObservable!: Observable<Food[]>;

  constructor(private foodService: FoodService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      if (params.searchName) {
        this.foodsObservable = this.foodService.getAllFoodsBySearchName(params.searchName);
        this.foodsObservable.subscribe((serverFoods) => {
          this.foods = serverFoods;
        });

      } else if (params.tagName) {
        this.foodsObservable = this.foodService.getAllFoodsByTagName(params.tagName)
        this.foodsObservable.subscribe((serverFoods) => {
          this.foods = serverFoods;
        });

      }
      else {
        this.foodsObservable = this.foodService.getAllFoods();
        this.foodsObservable.subscribe((serverFoods) => {
          this.foods = serverFoods;
        });

      }

    })


  }

}
