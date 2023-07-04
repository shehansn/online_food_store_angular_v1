import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';
import { Order } from 'src/app/shared/models/Order';

@Component({
  selector: 'app-payment-page',
  templateUrl: './payment-page.component.html',
  styleUrls: ['./payment-page.component.css']
})
export class PaymentPageComponent implements OnInit, OnChanges {

  order: Order = new Order();

  orderItemsDetailed: any
  orderItemsDetailedArray: any[] = [];
  orderItemFoodArray: any[] = [];
  orderTotal = 0;

  constructor(private orderService: OrderService,
    private router: Router,
    private userService: UserService) { }



  ngOnInit(): void {
    console.log("onInit")
    let { id } = this.userService.currentUser;
    console.log("id: ", id)
    this.orderService.getNewOrderForCurrentUser().subscribe({
      next: (order) => {
        this.order = order;
        console.log('order from payment page', order.items)
        this._getOrderItemsDetailed();
      },
      error: (err) => {
        console.log("onInit error", err)
        this.router.navigateByUrl('/checkout');
      }
    })


  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('orderItemsDetailedArray onchanges', this.orderItemsDetailedArray)
    console.log('orderItemFoodArray onchanges', this.orderItemFoodArray)
  }

  _getOrderItemsDetailed() {
    console.log('order from payment page _getOrderItemsDetailed', this.order.items)
    this.order.items.map((orderItem: any) => {
      this.orderService
        .getFood(orderItem.food.foodId)
        .pipe(take(1))
        .subscribe((food) => {

          this.orderItemsDetailed = food
          console.log('order itemsDetailed from payment page', this.orderItemsDetailed)

          const DetailedFood: any = {
            food: food,
            quantity: orderItem.food.quantity
          };

          this.orderItemsDetailedArray.push(DetailedFood);
          this.orderTotal = this.orderTotal + food.price * orderItem.quantity;
          //order total price can be get as input to this component from the checkout-page component
        });

      console.log('order items from payment page', orderItem.food)
      this.orderItemFoodArray.push(orderItem.food);
    })
    console.log('orderItemsDetailedArray', this.orderItemsDetailedArray)
    console.log('orderItemFoodArray', this.orderItemFoodArray)

  }


}
