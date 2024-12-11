import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../User/user.service';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  
  constructor(private router: Router,private snackBar: MatSnackBar,private userService:UserService) {}


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

  refreshLogin() {
    const accessExpiration = sessionStorage.getItem('accessExpiration');
    console.log('Access Expiration stored in sessionStorage:', accessExpiration);

    if (accessExpiration != null) {
      const currentTime = new Date().getTime(); // Get the current time in milliseconds
      console.log('Current time in milliseconds:', currentTime);

      if (currentTime > parseInt(accessExpiration, 10)) {
        this.generateAccessToken(); // Refresh the access token
        return true; // Token refreshed successfully
      }
    }

    // If expired or no expiration time is found, redirect to login page
    console.log('Token expired or not found. Redirecting to login.');
    this.showSessionExpiredMessage();
    this.router.navigate(['']); // Navigate to login page
    return false;
  } 

  generateAccessToken() {
    // Add your logic to generate the access token, possibly via an API call.
    console.log('Generating new access token...');
    this.userService.RefreshLogin()
    // Example logic for refreshing token
  }

  private showSessionExpiredMessage() {
    this.snackBar.open('Session expired. Please log in again.', 'Close', {
      duration: 5000, // Duration in milliseconds
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}