import { Order, OrderItem } from 'src/app/shared/models/Order';
import { Component, Input, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-order-items-list',
  templateUrl: './order-items-list.component.html',
  styleUrls: ['./order-items-list.component.css']
})
export class OrderItemsListComponent implements OnInit {

  @Input()
  orderItems!: any;
  orderItemsDetailed: any
  orderItemsDetailedArray: any[] = [];
  orderItemFoodArray: any[] = [];
  orderTotal = 0;

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    console.log('order from order items list', this.orderItems)
    this._getOrderItemsDetailed()
    //console.log('order itemsDetailed from order-items-list page', this.orderItemsDetailed)
    //

  }
  _getOrderItemsDetailed() {


    this.orderItems.map((orderItem: any) => {
      this.orderService
        .getFood(orderItem.food.foodId)
        .pipe(take(1))
        .subscribe((food) => {

          this.orderItemsDetailed = food
          console.log('order itemsDetailed from order-items-list page', this.orderItemsDetailed)

          const DetailedFood: any = {
            food: food,
            quantity: orderItem.food.quantity
          };

          this.orderItemsDetailedArray.push(DetailedFood);
          this.orderTotal = this.orderTotal + food.price * orderItem.quantity;
          //order total price can be get as input to this component from the checkout-page component
        });

      console.log('order items from order-items-list page', orderItem.food)
      this.orderItemFoodArray.push(orderItem.food);
    })
    console.log(this.orderItemsDetailedArray)
    console.log(this.orderItemFoodArray)

  }

}


