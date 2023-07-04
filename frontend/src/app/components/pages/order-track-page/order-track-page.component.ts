import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';
import { OrderService } from 'src/app/services/order.service';
import { Order } from 'src/app/shared/models/Order';

@Component({
  selector: 'app-order-track-page',
  templateUrl: './order-track-page.component.html',
  styleUrls: ['./order-track-page.component.css']
})
export class OrderTrackPageComponent implements OnInit {

  order!: Order;
  orderItemsDetailed: any
  orderItemsDetailedArray: any[] = [];
  orderItemFoodArray: any[] = [];
  orderTotal = 0;

  constructor(private activatedRoutee: ActivatedRoute, private orderService: OrderService) { }
  ngOnInit(): void {
    const params = this.activatedRoutee.snapshot.params;
    if (!params.orderId) return;

    this.orderService.trackOrderById(params.orderId).subscribe(order => {
      this.order = order;
      this._getOrderItemsDetailed();
    })
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
