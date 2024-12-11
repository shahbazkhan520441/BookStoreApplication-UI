import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BookService } from 'src/app/services/Book/book.service';
import { CartService } from 'src/app/services/Cart/cart.service';
import { SharedService } from 'src/app/services/Shared/shared.service';
import { UserService } from 'src/app/services/User/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isClicked: boolean = false;
  username: string | null = null;
  books: any[] = [];
  cartCount: number = 0;
  searchQuery: string = '';
  filteredBooks: any[] = [];

  isNavbarVisible: boolean = true; // Default navbar visibility
  constructor(
    private router: Router,
    private booksService: BookService,
    private sharedService: SharedService,
    private cartService: CartService,
    private snackbar: MatSnackBar,
    private userService:UserService
  ) {}

  toggleNavbar() {
    this.isNavbarVisible = !this.isNavbarVisible; // Toggle navbar visibility
  }

  ngOnInit() {
    this.extractUserName();
   
    this.fetchCartCount();
  }


  toggleClick(): void {
    this.isClicked = !this.isClicked;
  }
  isLoggedIn(): boolean {
    return !!sessionStorage.getItem('accessExpiration');
  }
  logout(): void {
  // Clear localStorage and sessionStorage


    this.userService.logOut().subscribe(
      (reponse)=>{
        console.log(reponse)
        localStorage.clear();
        sessionStorage.clear();
        this.snackbar.open('Logout Successfully', '', { duration: 3000 });
        this.router.navigateByUrl('login');
      },
      (error)=>{
       console.log(error+ "in logout")
      }
    )
    
  }


  extractUserName(): void {
    const username = sessionStorage.getItem('username');
    if (username) {
      try {
        this.username = username || 'User';
        console.log(this.username)
      } catch (error) {
        console.error('Failed to decode username', error);
      }
    }
  }

  


  fetchCartCount(): void {
    this.cartService.getCartById().subscribe(
      (response: any) => {
        if (response && Array.isArray(response.data)) {
          // Filter out items where isUnCarted or isOrdered is true
          console.log(response.data)
          const validItems = response.data
          this.cartCount = validItems.length;
          console.log(this.cartCount)
        } else {
          console.error('Unexpected response format:', response);
          this.cartCount = 0;
        }
      },
      (error) => {
        console.error('Error fetching cart count:', error);
      }
    );
  }
  openCart(): void {
    this.router.navigate(['/myCart']);
  }
  openOrder() {
    this.router.navigateByUrl('/order');
  }
  openWishList() {
    this.router.navigateByUrl('/wishlist');
  }
  filterBooks(): void {
    console.log("in filter books"+ this.searchQuery)
    this.sharedService.updateSearchQuery(this.searchQuery);
  }
}
