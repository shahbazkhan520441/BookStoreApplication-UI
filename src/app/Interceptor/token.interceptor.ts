import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SharedService } from '../services/Shared/shared.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  private refreshingToken = false;
  private refreshTokenSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private sharedService: SharedService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessExpiration = sessionStorage.getItem('accessExpiration');
    const currentTime = new Date().getTime();

    // Check if the access token has expired
    if (accessExpiration && currentTime > parseInt(accessExpiration, 10)) {
      if (!this.refreshingToken) {
        // Start refreshing token
        this.refreshingToken = true;

        return this.sharedService.generateAccessToken().pipe(
          switchMap((status) => {
            console.log(status)
            
            // Token successfully refreshed
            this.refreshingToken = false;
            this.refreshTokenSubject.next(true); // Notify queued requests
            return next.handle(req); // Retry the original request
          }),
          catchError((error) => {
            // Refresh token failed
            this.refreshingToken = false;
            this.refreshTokenSubject.next(false); // Notify queued requests
            this.router.navigate(['login']); // Redirect to login
            return throwError(() => error);
          })
        );
      } else {
        // Wait for the token refresh to complete
        return this.refreshTokenSubject.pipe(
          filter((status) => status !== null), // Wait for either success or failure
          take(1),
          switchMap((status) => {
            console.log(status)
            if (status) {
              // Token refresh succeeded, retry the request
              return next.handle(req);
            } else {
              // Token refresh failed, redirect to login
              this.router.navigate(['login']);
              return throwError(() => new Error('Token refresh failed'));
            }
          })
        );
      }
    }

    // Token is valid, proceed with the request
    return next.handle(req);
  }
}
