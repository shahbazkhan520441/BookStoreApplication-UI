import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { UserService } from '../services/User/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  static canActivate: CanActivateFn = (): Observable<boolean> => {
    const router = inject(Router);
    const userService = inject(UserService);

    // Retrieve access expiration time from sessionStorage
    const accessExpiration = sessionStorage.getItem('accessExpiration');
    console.log('Access Expiration stored in sessionStorage:', accessExpiration);

    if (accessExpiration != null) {
      const currentTime = new Date().getTime(); // Get the current time in milliseconds
      console.log('Current time in milliseconds:', currentTime);

      // If the token is valid, allow access
      if (currentTime < parseInt(accessExpiration, 10)) {
        return of(true); // Allow access if the token is still valid
      }

      // If expired, call the RefreshLogin function
      console.log('Token expired. Refreshing login token.');
      return userService.RefreshLogin().pipe(
        switchMap((res: any) => {
          const authResponse = res.data; // Access the data from the response
          const accessExpirationInSeconds = authResponse.accessExpiration;
          console.log('Access Expiration (seconds):', accessExpirationInSeconds);

          const currentTimeInMilliseconds = new Date().getTime();
          const accessExpirationInMilliseconds =
            currentTimeInMilliseconds + accessExpirationInSeconds * 1000;
          console.log('Access Expiration (milliseconds):', accessExpirationInMilliseconds);

          // Store the new expiration time in sessionStorage
          sessionStorage.setItem('accessExpiration', accessExpirationInMilliseconds.toString());

          return of(true); // Allow access after refreshing the token
        }),
        catchError((error) => {
          console.error('Error during token refresh:', error);
          router.navigate(['login']); // Redirect to login on failure
          return of(false); // Deny access
        })
      );
    }

    // If no expiration time is found, redirect to login
    console.log('No token found. Redirecting to login.');
    router.navigate(['login']);
    return of(false); // Deny access
  };
}
