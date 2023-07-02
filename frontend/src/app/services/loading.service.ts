import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService implements OnInit {

  //when using this behaviour subject all the instances that use this service will notify the status changes of this isLoadingSubject
  private isLoadingSubject = new BehaviorSubject<boolean>(false);

  constructor() { }

  ngOnInit(): void {
  }

  showLoading() {
    this.isLoadingSubject.next(true);
  }

  hideLoading() {
    this.isLoadingSubject.next(false);
  }

  get isLoading() {
    return this.isLoadingSubject.asObservable();
  }

}
