import { FoodService } from 'src/app/services/food.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { Cart, CartItemDetailed, CartItem } from 'src/app/shared/models/Cart';
import { Food } from 'src/app/shared/models/Food';
import { Subject, takeUntil } from 'rxjs';

// interface CartItem {
//   food: any;
//   quantity: number;
// }

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css']
})
export class CartPageComponent implements OnInit {

  cartItemsDetailed: CartItemDetailed[] = [];
  cartCount = 0;
  endSubs$ = new Subject<void>();

  constructor(private cartService: CartService, private router: Router, private foodService: FoodService) { }

  ngOnInit(): void {

    this._getCartDetails();

  }
  private _getCartDetails() {
    this.cartService.cart$.pipe(takeUntil(this.endSubs$)).subscribe((respCart) => {
      this.cartItemsDetailed = [];
      this.cartCount = respCart?.items?.length ?? 0;
      respCart.items?.forEach((cartItem) => {
        console.log('cartitem from cart page', cartItem)
        console.log('cartitem from cart page', cartItem.foodId)
        this.foodService.getFood(cartItem.foodId).subscribe((respProduct: any) => {
          this.cartItemsDetailed.push({
            food: respProduct,
            quantity: cartItem.quantity
          });
        });

      });
    });
  }



  deleteCartItem(cartItem: CartItemDetailed) {
    this.cartService.deleteCartItem(cartItem.food.id);
  }


  updateCartItemQuantity(cartItem: CartItemDetailed, quantityInString: string) {
    const quantity = parseInt(quantityInString);
    this.cartService.setCartItem(
      {
        foodId: cartItem.food.id,
        quantity: quantity
      },
      true
    );
  }

}
