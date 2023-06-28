import { Injectable, OnInit } from '@angular/core';
import { Cart, CartItem } from '../shared/models/Cart';
import { BehaviorSubject, Observable } from 'rxjs';

export const CART_KEY = 'cart';

@Injectable({
  providedIn: 'root'
})
export class CartService implements OnInit {

  cart$: BehaviorSubject<Cart> = new BehaviorSubject(this.getCart());

  constructor() { }

  ngOnInit(): void {

  }

  initCartLocalStorage() {
    const cart: Cart = this.getCart();
    if (!cart) {
      const intialCart = {
        items: []
      };
      const intialCartJson = JSON.stringify(intialCart);
      localStorage.setItem(CART_KEY, intialCartJson);
    }
  }

  getCart(): Cart {
    const cartJsonString: any = localStorage.getItem(CART_KEY);
    const cart: Cart = JSON.parse(cartJsonString);
    return cart;

  }


  setCartItem(cartItem: CartItem, updateCartItem?: boolean): Cart {
    console.log('setCartItem', JSON.stringify(cartItem));

    const cart = this.getCart();
    const cartItemExist = cart.items?.find((item) => item.foodId === cartItem.foodId);
    console.log('cartItemExist', cartItemExist);
    if (cartItemExist) {
      cart.items?.map((item) => {
        if (item.foodId === cartItem.foodId) {
          if (updateCartItem) {
            item.quantity = cartItem.quantity;
          } else {
            console.log('cartItem.quantity', cartItem.quantity);
            item.quantity = item.quantity ? + cartItem.quantity : 0;
          }

          return item;
        }
        return item;
      });
    } else {
      cart.items?.push(cartItem);
    }

    const cartJson = JSON.stringify(cart);
    localStorage.setItem(CART_KEY, cartJson);
    this.cart$.next(cart);
    return cart;
  }


  deleteCartItem(productId: string) {
    const cart = this.getCart();
    const newCart = cart.items?.filter((item) => item.foodId !== productId);

    cart.items = newCart;

    const cartJsonString = JSON.stringify(cart);
    localStorage.setItem(CART_KEY, cartJsonString);

    this.cart$.next(cart);
  }

  emptyCart() {
    const intialCart = {
      items: []
    };
    const intialCartJson = JSON.stringify(intialCart);
    localStorage.setItem(CART_KEY, intialCartJson);
    this.cart$.next(intialCart);
  }

}
