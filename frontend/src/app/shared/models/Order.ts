export class Order {
  id?: string;
  orderItems?: OrderItem;
  phone?: string;
  status?: number;
  totalPrice?: number;
  name?: string;
  address?: string;
  dateOrdered?: string;
}

export class OrderItem {
  product?: string;
  quantity?: number;
}
