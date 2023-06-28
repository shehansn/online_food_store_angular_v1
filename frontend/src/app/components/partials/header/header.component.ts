import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, take, takeUntil } from 'rxjs';
import { CartService } from 'src/app/services/cart.service';
import { FoodService } from 'src/app/services/food.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  endSubs$ = new Subject<void>();
  count!: any;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this._getCartCount();
  }

  _getCartCount() {
    this.cartService.cart$.pipe(takeUntil(this.endSubs$)).subscribe((cart) => {
      this.count = cart?.items?.length ?? 0;
    });
  }
}
