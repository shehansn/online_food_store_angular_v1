import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpEventType
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoadingService } from 'src/app/services/loading.service';

var pendingResults = 0;
@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  constructor(private loadingService: LoadingService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    //alert('i am intercepter initial call')
    this.loadingService.showLoading();
    pendingResults = pendingResults + 1;

    return next.handle(request).pipe(
      tap({
        next: (event) => {
          if (event.type === HttpEventType.Response) {
            this.hanleHideLoading();
          }
        },
        error: (_) => {
          this.hanleHideLoading();
        }
      })
    );
  }

  hanleHideLoading() {
    pendingResults = pendingResults - 1;
    if (pendingResults === 0) {
      this.loadingService.hideLoading();

    }
  }

}
