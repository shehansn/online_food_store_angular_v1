import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, take, takeUntil } from 'rxjs';
import { CartService } from 'src/app/services/cart.service';
import { FoodService } from 'src/app/services/food.service';

@Component({
  selector: 'app-cart-summary',
  templateUrl: './cart-summary.component.html',
  styleUrls: ['./cart-summary.component.css']
})
export class CartSummaryComponent implements OnInit {
  endSubs$ = new Subject<void>();
  totalPrice!: number;
  isCheckout = false;
  count!: number;

  constructor(private router: Router,
    private cartService: CartService, private foodService: FoodService) {

  }

  ngOnInit(): void {
    this._getCartSummary();
  }

  _getCartSummary() {
    this.cartService.cart$.pipe(takeUntil(this.endSubs$)).subscribe((cart) => {
      this.totalPrice = 0;
      this.count = 0;
      if (cart) {
        cart.items?.map((item) => {
          // this.count++
          this.foodService
            .getFood(item.foodId)
            .pipe(take(1))
            .subscribe((food) => {
              this.totalPrice += food.price * item.quantity;
              this.count = this.count + item.quantity;
            });
        });
      }
    });
  }

}
