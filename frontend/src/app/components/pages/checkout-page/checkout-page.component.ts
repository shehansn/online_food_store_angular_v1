import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subject, take, takeUntil } from 'rxjs';
import { CartService } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';
import { Order } from 'src/app/shared/models/Order';

@Component({
  selector: 'app-checkout-page',
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.css']
})
export class CheckoutPageComponent implements OnInit {

  order!: Order;
  orderItems: any;
  checkoutForm!: FormGroup;
  orderTotalPrice = 0;
  endSubs$ = new Subject<void>();

  constructor(
    private cartService: CartService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private toastrService: ToastrService,
    private orderService: OrderService
  ) {


  }

  ngOnInit(): void {
    // const cart = this.cartService.getCart();
    // console.log('cart from checkout page', cart)
    //this.order.items = cart;
    //console.log('this.order.items from checkout page', this.order.items)

    //console.log(' this._getOrderSummary(); from checkout page', this._getOrderSummary())
    //this.order.totalPrice = this.totalPrice;
    //console.log('this.totalPrice from checkout page', this.totalPrice)
    //console.log(' this.order.total from checkout page', this.order.totalPrice)
    this._getOrderSummary();
    this._initCheckoutForm();
    this._getCartItems();
  }

  _initCheckoutForm() {
    let { name, address } = this.userService.currentUser;
    this.checkoutForm = this.formBuilder.group({
      name: [name, Validators.required],
      address: [address, Validators.required],

    })
  }


  _getCartItems() {
    const cart = this.cartService.getCart();
    console.log('cart from checkout', cart);
    this.orderItems = cart.items?.map((item: any) => {
      return {
        food: item,
        quantity: item.quantity

      };
    });
    console.log(' orderItems from checkout', this.orderItems);
  }

  _getOrderSummary() {
    this.cartService.cart$.pipe(takeUntil(this.endSubs$)).subscribe((cart) => {

      if (cart) {
        cart.items?.map((item) => {
          console.log(' cart item checkout page', item)
          this.orderService
            .getFood(item.foodId)
            .pipe(take(1))
            .subscribe((food) => {
              this.orderTotalPrice = this.orderTotalPrice + food.price * item.quantity;
            });
        });

      }

    });

  }

  get formControl() {
    return this.checkoutForm.controls;
  }

  createOrder() {
    if (this.checkoutForm.invalid) {
      this.toastrService.warning('Please fill the inputs', 'Invalid Inputs');
      return;
    }
    else {
      const order: Order = {
        // orderItems: this.orderItems,
        name: this.formControl.name.value,
        address: this.formControl.address.value,
        totalPrice: this.orderTotalPrice,
        orderItems: this.orderItems,
      };
      this.order = order;
      console.log('order', order);
    }
  }

}
