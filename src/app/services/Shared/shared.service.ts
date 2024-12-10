import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CloseScrollStrategy } from '@angular/cdk/overlay';


@Injectable({
  providedIn: 'root',
})
export class SharedService {

  url: string = 'http://localhost:8080'; 
  
  constructor(private router: Router,private snackBar: MatSnackBar, private http:HttpClient) {}


  private loginSubject = new BehaviorSubject<boolean>(false);
  loginStatus$ = this.loginSubject.asObservable();

  private selectedBookSubject = new BehaviorSubject<any>(null);
  selectedBook$ = this.selectedBookSubject.asObservable();

  private searchQuerySource = new BehaviorSubject<string>('');
  searchQuery$ = this.searchQuerySource.asObservable();

  

  updateLoginStatus(status: boolean) {
    this.loginSubject.next(status);
  }

  updateSelectedBook(book: any) {
    this.selectedBookSubject.next(book);
  }

  updateSearchQuery(query: string) {
    this.searchQuerySource.next(query);
  }

  // refreshLogin() {
  //   const accessExpiration = sessionStorage.getItem('accessExpiration');
  //   console.log('Access Expiration stored in sessionStorage:', accessExpiration);

  //   if (accessExpiration != null) {
  //     const currentTime = new Date().getTime(); // Get the current time in milliseconds
  //     console.log('Current time in milliseconds:', currentTime);

  //     if (currentTime > parseInt(accessExpiration,10)) {
  //       this.generateAccessToken(); // Refresh the access token
  //       return true; // Token refreshed successfully
  //     }
  //   }

  //   // If expired or no expiration time is found, redirect to login page
  //   console.log('Token expired or not found. Redirecting to login.');
  //   this.showSessionExpiredMessage();
  //   this.router.navigate(['']); // Navigate to login page
  //   return false;
  // }



  private showSessionExpiredMessage() {
    this.snackBar.open('Session expired. Please log in again.', 'Close', {
      duration: 5000, // Duration in milliseconds
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }


//   generateAccessToken(): Observable<any> {
//   console.log('Attempting to generate access token...');
//   const endpoint = `${this.url}/api/v1/refreshLogin`;
//   console.log(endpoint)
//   return this.http.post<any>('http://localhost:8080/api/v1/refreshLogin', {}, { withCredentials: true,  headers: new HttpHeaders({
//     'Content-Type': 'application/json',
//   }) },).pipe(
//     tap((authResponse) => {
//       console.log('Auth response received:', authResponse);

//       if (authResponse && authResponse.accessExpiration) {
//         sessionStorage.removeItem('accessExpiration');

//         const accessExpirationInSeconds = authResponse.accessExpiration;
//         const currentTimeInMilliseconds = new Date().getTime();
//         const newAccessExpirationInMilliseconds =
//           currentTimeInMilliseconds + accessExpirationInSeconds * 1000;

//         sessionStorage.setItem(
//           'accessExpiration',
//           newAccessExpirationInMilliseconds.toString()
//         );

//         console.log(
//           `Access token refreshed. New expiration: ${newAccessExpirationInMilliseconds}`
//         );
//       } else {
//         console.error('Auth response is missing expiration details.');
//       }
//     }),
//     catchError((error) => {
//       console.error('Error refreshing access token:', error);
//       return throwError(() => error);
//     })
//   );
// }

generateAccessToken(): void {
  console.log('Attempting to generate access token...');
  
  const endpoint = `${this.url}/api/v1/refreshLogin`;
  console.log('Calling endpoint:', endpoint);

  this.http.post<any>(endpoint, {}, { 
    withCredentials: true, 
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  })
  // .pipe(
  //   tap((authResponse) => {
  //     console.log('Auth response received:', authResponse);
  //   }),
  //   catchError((error) => {
  //     console.error('Error refreshing access token:', error);
  //     return throwError(() => error);
  //   })
   .subscribe({
    next: (response) => {
      console.log('Response from API:', response);
      // You can also do something with the response here, if needed.
    },
    error: (err) => {
      console.error('Request failed with error:', err);
    }
  });
}




}
