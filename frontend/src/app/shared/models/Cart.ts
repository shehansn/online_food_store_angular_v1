export class Cart {
  items?: CartItem[];
}

export class CartItem {
  foodId?: string;
  quantity?: any;
}

export class CartItemDetailed {
  food?: any;
  quantity?: number;
}
