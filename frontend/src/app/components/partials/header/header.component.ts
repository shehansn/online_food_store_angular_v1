import { UserService } from 'src/app/services/user.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, take, takeUntil } from 'rxjs';
import { CartService } from 'src/app/services/cart.service';
import { FoodService } from 'src/app/services/food.service';
import { User } from 'src/app/shared/models/User';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  endSubs$ = new Subject<void>();
  count!: any;
  user!: User;

  constructor(private cartService: CartService, private userService: UserService) { }

  ngOnInit(): void {
    this._getCartCount();
    this._getUser();
  }

  _getCartCount() {
    this.cartService.cart$.pipe(takeUntil(this.endSubs$)).subscribe((cart) => {
      this.count = cart?.items?.length ?? 0;
    });
  }

  _getUser() {
    this.userService.userSubject$.subscribe((newUser) => {
      this.user = newUser;
      console.log('user from header', this.user)
    })
  }

  logout() {
    this.userService.logout();
  }

}
