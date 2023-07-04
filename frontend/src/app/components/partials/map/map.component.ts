import { Order } from './../../../shared/models/Order';
import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { LatLng, LatLngExpression, LatLngLiteral, LatLngTuple, LeafletMouseEvent, Map, Marker, icon, map, marker, tileLayer } from 'leaflet';
import { LocationService } from 'src/app/services/location.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnChanges {

  private readonly DEFAULT_LATLNG: LatLngTuple = [13.75, 21.62]
  private readonly MARKER_ZOOM_LEVEL = 16;
  private readonly MARKER_ICON = icon({
    iconUrl:
      'https://res.cloudinary.com/foodmine/image/upload/v1638842791/map/marker_kbua9q.png',
    iconSize: [28, 30],
    iconAnchor: [21, 42],
  });

  @Input()
  order!: Order;

  @Input()
  readonly = false;

  @ViewChild('map', { static: true })
  mapRef!: ElementRef;
  map!: Map;
  currentMarker!: Marker;

  newOrder!: Order;

  constructor(private locationService: LocationService) { }

  ngOnInit(): void {
    console.log('order from map component oninit', this.order);
    this.initializeMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    //console.log('order from map component onchange', this.order);

    if (!this.order) return;
    this.initializeMap();

    if (this.readonly && this.addressLatLng) {
      this.showLocationReadOnlyMode();
    }

  }
  showLocationReadOnlyMode() {
    const m = this.map;
    this.setMarker(this.addressLatLng);
    m.setView(this.addressLatLng, this.MARKER_ZOOM_LEVEL);

    m.dragging.disable();
    m.touchZoom.disable();
    m.doubleClickZoom.disable();
    m.scrollWheelZoom.disable();
    m.boxZoom.disable();
    m.keyboard.disable();
    m.off('click');
    m.tap?.disable();
    this.currentMarker.dragging?.disable();
  }


  initializeMap() {
    //if map is already initialized it returns none, if not initialize map()
    if (this.map) return;
    this.map = map(this.mapRef.nativeElement, {
      attributionControl: false
    }).setView(this.DEFAULT_LATLNG, 1)

    tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(this.map);
    //this.findMyLocation();

    this.map.on('click', (e: LeafletMouseEvent) => {
      this.setMarker(e.latlng);
    })

  }

  findMyLocation() {
    this.locationService.getCurrentLocation().subscribe({
      next: (latlng) => {
        console.log('current location', latlng)
        this.map.setView(latlng, this.MARKER_ZOOM_LEVEL)
        this.setMarker(latlng)
      }
    })
  }

  findMyOrder() {
    console.log('order from map component findMyOrder()', this.order);
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
    console.log('latlng from set addressLatLng', latlng)
    console.log('order latlng from map component ', this.order.addressLatLng);
    console.log('order from map component page ', this.order);
    //this.newOrder = this.order;
  }

  get addressLatLng() {
    return this.order.addressLatLng!;
  }

}
