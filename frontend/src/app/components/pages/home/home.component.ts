import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FoodService } from 'src/app/services/food.service';
import { Food } from 'src/app/shared/models/Food';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  foods: Food[] = [];

  constructor(private foodService: FoodService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      if (params.searchName) {
        this.foods = this.foodService.getAllFoodsBySearchName(params.searchName);
      } else if (params.tagName) {
        this.foods = this.foodService.getAllFoodsByTagName(params.tagName)
      }
      else {
        this.foods = this.foodService.getAllFoods();
      }
    })


  }

}
