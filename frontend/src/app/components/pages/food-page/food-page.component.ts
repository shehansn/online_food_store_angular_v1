import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Food } from 'src/app/shared/models/Food';
import { FoodService } from 'src/app/services/food.service';
import { CartService } from 'src/app/services/cart.service';
import { CartItem } from 'src/app/shared/models/Cart';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-food-page',
  templateUrl: './food-page.component.html',
  styleUrls: ['./food-page.component.css']
})
export class FoodPageComponent implements OnInit {

  food!: Food;
  quantity = 1;
  endSubs$ = new Subject<void>();

  constructor(private activatedRoute: ActivatedRoute, private foodService: FoodService,
    private cartService: CartService, private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      if (params.id) {
        //this.food = this.foodService.getFoodById(params.id);
        this._getProduct(params.id);
      }
    })

    this.cartService.initCartLocalStorage()

  }

  addToCart() {
    const cartItem: CartItem = {
      foodId: this.food.id,
      quantity: this.quantity
    };
    this.cartService.setCartItem(cartItem, false)
    //console.log('item from add to cart page', this.food)
    this.router.navigateByUrl('/cart-page')
  }

  private _getProduct(id: string) {
    this.foodService.getFood(id).subscribe((resFood) => {
      this.food = resFood;
    });
  }

}
