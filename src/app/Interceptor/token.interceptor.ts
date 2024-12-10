import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SharedService } from '../services/Shared/shared.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  private refreshingToken = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private sharedService: SharedService, private router: Router) {}


  private refreshQueue: Array<Function> = [];

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      const accessExpiration = sessionStorage.getItem('accessExpiration');
      const currentTime = new Date().getTime();
  
      if (true) {
        console.log('in if')
          // Token expired, let's refresh
          if (!this.refreshingToken) {
              this.refreshingToken = true;
  
               this.sharedService.generateAccessToken();
              // .pipe(
              //     switchMap(() => {
              //         this.refreshingToken = false;
              //         this.refreshQueue.forEach(callback => callback());  // Execute queued requests
              //         this.refreshQueue = [];
              //         return next.handle(req);
              //     }),
              //     catchError((error) => {
              //         this.refreshingToken = false;
              //         this.refreshQueue = [];
              //         this.router.navigate(['login']);
              //         return throwError(() => error);
              //     })
              // );

              
          } else {
              // Token refresh in progress, queue the request
              return new Observable<HttpEvent<any>>((observer) => {
                  this.refreshQueue.push(() => {
                      next.handle(req).subscribe(observer);
                  });
              });
          }
      }
  
      return next.handle(req);
  }



  
}
