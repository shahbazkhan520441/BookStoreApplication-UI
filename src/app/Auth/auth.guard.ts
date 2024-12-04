import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {

  static canActivate: CanActivateFn = () => {
    const router = inject(Router);
    // Retrieve access expiration time from sessionStorage
    const accessExpiration = sessionStorage.getItem('accessExpiration');
    console.log('Access Expiration stored in sessionStorage:', accessExpiration);

    if (accessExpiration != null) {

      const currentTime = new Date().getTime();  // Get the current time in milliseconds
      console.log('Current time in milliseconds:', currentTime);

      // Compare the current time with the stored access expiration time
      if (currentTime < parseInt(accessExpiration, 10)) {
        return true;  // Allow access if the token is still valid
      }
    }

    // If expired or no expiration time is found, redirect to login page
    console.log('Token expired or not found. Redirecting to login.');
    router.navigate(['']);  // Navigate to login page
    return false;
  };
}
