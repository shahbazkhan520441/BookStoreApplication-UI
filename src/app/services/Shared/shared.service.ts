import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { UserService } from '../User/user.service';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private readonly baseUrl: string = 'http://localhost:8080';

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private http: HttpClient,
    private userService: UserService
  ) {}

  // BehaviorSubjects for reactive state management
  private loginSubject = new BehaviorSubject<boolean>(false);
  loginStatus$ = this.loginSubject.asObservable();

  private selectedBookSubject = new BehaviorSubject<any>(null);
  selectedBook$ = this.selectedBookSubject.asObservable();

  private searchQuerySource = new BehaviorSubject<string>('');
  searchQuery$ = this.searchQuerySource.asObservable();

  /**
   * Update the login status in the application.
   * @param status - Boolean indicating login status
   */
  updateLoginStatus(status: boolean): void {
    this.loginSubject.next(status);
  }

  /**
   * Update the currently selected book.
   * @param book - The selected book object
   */
  updateSelectedBook(book: any): void {
    this.selectedBookSubject.next(book);
  }

  /**
   * Update the search query value.
   * @param query - The updated search query
   */
  updateSearchQuery(query: string): void {
    this.searchQuerySource.next(query);
  }

  /**
   * Generate a new access token by calling the refresh endpoint.
   * Handles updating the session expiration time.
   * @returns Observable of the HTTP response
   */
  generateAccessToken(): Observable<any> {
    console.log('Attempting to generate access token...');
    const endpoint = `${this.baseUrl}/api/v1/refreshLogin`;

    return this.http
      .post<any>(
        endpoint,
        {},
        {
          withCredentials: true,
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
        }
      )
      .pipe(
        tap((authResponse) => {
          console.log('Auth response received:', authResponse);

          if (authResponse && authResponse.accessExpiration) {
            sessionStorage.removeItem('accessExpiration');

            const accessExpirationInSeconds = authResponse.accessExpiration;
            const currentTimeInMilliseconds = new Date().getTime();
            const newAccessExpirationInMilliseconds =
              currentTimeInMilliseconds + accessExpirationInSeconds * 1000;

            sessionStorage.setItem(
              'accessExpiration',
              newAccessExpirationInMilliseconds.toString()
            );

            console.log(
              `Access token refreshed. New expiration: ${newAccessExpirationInMilliseconds}`
            );
          } else {
            console.error('Auth response is missing expiration details.');
          }
        }),
        catchError((error) => {
          console.error('Error refreshing access token:', error);
          this.handleTokenRefreshError();
          return throwError(() => error);
        })
      );
  }

  /**
   * Handle token refresh errors, including showing a message and navigating to login.
   */
  private handleTokenRefreshError(): void {
    this.showSessionExpiredMessage();
    this.router.navigate(['login']); // Ensure 'login' route exists
  }

  /**
   * Show a session expiration message to the user.
   */
  private showSessionExpiredMessage(): void {
    this.snackBar.open('Session expired. Please log in again.', 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
