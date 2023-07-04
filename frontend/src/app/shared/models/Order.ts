import { LatLng } from "leaflet";

export class Order {
  id?: string;
  items?: any;
  phone?: string;
  status?: number;
  totalPrice?: number;
  name?: string;
  address?: string;
  addressLatLng?: LatLng;
  dateOrdered?: string;
  user?: any;
  paymentId?: string;
  createdAt?: string;
}

export class OrderItem {
  product?: string;
  quantity?: number;
}
