import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { LatLng, LatLngExpression, LatLngTuple, LeafletMouseEvent, Marker, icon, marker, tileLayer, Map, map } from 'leaflet';
import { ToastrService } from 'ngx-toastr';
import { Subject, take, takeUntil } from 'rxjs';
import { CartService } from 'src/app/services/cart.service';
import { LocationService } from 'src/app/services/location.service';
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


  private readonly DEFAULT_LATLNG: LatLngTuple = [13.75, 21.62]
  private readonly MARKER_ZOOM_LEVEL = 16;
  private readonly MARKER_ICON = icon({
    iconUrl:
      'https://res.cloudinary.com/foodmine/image/upload/v1638842791/map/marker_kbua9q.png',
    iconSize: [28, 30],
    iconAnchor: [21, 42],
  });


  @ViewChild('map', { static: true })
  mapRef!: ElementRef;
  map!: Map;
  currentMarker!: Marker;


  constructor(
    private cartService: CartService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private toastrService: ToastrService,
    private orderService: OrderService,
    private router: Router,
    private locationService: LocationService
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
    this.initializeOrder();
    this.initializeMap();
  }

  initializeOrder() {
    const order: Order = {
      // orderItems: this.orderItems,
      name: this.formControl.name.value,
      address: this.formControl.address.value,
      totalPrice: this.orderTotalPrice,
      items: this.orderItems,
    };
    this.order = order;
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
    else if (!this.order.addressLatLng) {
      this.toastrService.warning('Please Select Your Location', 'Invalid Inputs');
      return;
    }
    else {
      this.order.name = this.formControl.name.value;
      this.order.address = this.formControl.address.value;
      this.order.totalPrice = this.orderTotalPrice;
      this.order.items = this.orderItems;
      this.order.user = this.userService.currentUser;
      //console.log('',this.order)
      /*
            const order: Order = {
              // orderItems: this.orderItems,
              name: this.formControl.name.value,
              address: this.formControl.address.value,
              totalPrice: this.orderTotalPrice,
              orderItems: this.orderItems,
              //addressLatLng:
            };
            */
      //this.order = order;
      console.log('order from checkout page', this.order);

      this.orderService.createOrder(this.order).subscribe({
        next: () => {
          this.router.navigateByUrl('/payment');
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Cart');
        }
      })

    }
  }

  /** */
  /**//////////////////////functions for map service/////////////// */
  initializeMap() {
    //if map is already initialized it returns none, if not initialize map()
    if (this.map) return;
    this.map = map(this.mapRef.nativeElement, {
      attributionControl: false
    }).setView(this.DEFAULT_LATLNG, 1)

    tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(this.map);

    this.map.on('click', (e: LeafletMouseEvent) => {
      this.setMarker(e.latlng);
    })

  }

  findMyLocation() {
    this.locationService.getCurrentLocation().subscribe({
      next: (latlng) => {
        console.log('current location from map', latlng)
        this.map.setView(latlng, this.MARKER_ZOOM_LEVEL)
        this.setMarker(latlng)
      }
    })
  }

  setMarker(latlng: LatLngExpression) {
    this.addressLatLng = latlng as LatLng;
    if (this.currentMarker) {
      this.currentMarker.setLatLng(latlng);
      return;
    }

    this.currentMarker = marker(latlng, {
      draggable: true,
      icon: this.MARKER_ICON
    }).addTo(this.map);


    this.currentMarker.on('dragend', () => {
      this.addressLatLng = this.currentMarker.getLatLng();
    });

  }

  set addressLatLng(latlng: LatLng) {
    if (!latlng.lat.toFixed) return;

    latlng.lat = parseFloat(latlng.lat.toFixed(8));
    latlng.lng = parseFloat(latlng.lng.toFixed(8));
    this.order.addressLatLng = latlng;
    console.log('latlng from set addressLatLng checkout', latlng)
    console.log('order latlng from map checkout ', this.order.addressLatLng);
    console.log('order from map checkout page ', this.order);
  }

  get addressLatLng() {
    return this.order.addressLatLng!;
  }

}
