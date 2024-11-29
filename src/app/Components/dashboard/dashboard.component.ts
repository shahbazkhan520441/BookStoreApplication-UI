
import { Component } from '@angular/core';
import { BookService } from 'src/app/services/Book/book.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/Shared/shared.service';
import { CartService } from 'src/app/services/Cart/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { HttpService } from 'src/app/services/Http/http.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  books: any[] = [];
  cartCount: number = 0;
  filteredBooks: any[] = [];
  searchQuery: string = '';
  constructor(
    private cookieService: CookieService,
    private router: Router,

    private booksService: BookService,
    private sharedService: SharedService,
    private cartService: CartService,
    private matSnackBar: MatSnackBar,

    private http:HttpService
    
  ) {}

  ngOnInit() {

    
    console.log('in side ngOnInit')
    this.fetchBooks();



    // if(userRole='seller'){
    // this.sharedService.loginStatus$.subscribe((isLoggedIn) => {
    //   console.log(isLoggedIn+ 'in dasboard login or not')
    //   if (isLoggedIn) {
    //     this.fetchBooks();
    //   }
    // });
    // }

    // ----------------------------------
    // this.sharedService.searchQuery$.subscribe((query: string) => {
    //   this.searchQuery = query;
    //   this.filteredBooks = this.books.filter((book) =>
    //     book.title.toLowerCase().includes(this.searchQuery.toLowerCase())
    //   );
    // });
  }


  fetchBooks(): void {
    
    console.log('in fetch mthod')
     this.booksService.getAllBooks().subscribe(
        (response: any) => {
           console.log(response)
          if (response && Array.isArray(response.data)) {
            this.books = response.data.map((book: any) => ({
              
              bookid: book.id,
              image: book.bookImage, // Map bookImage to image
              title: book.bookName, // Map bookName to title
              author: book.bookAuthor, // Map authorName to author
              rating: book.rating || 'N/A', // Provide a default value if rating is missing
              ratingCount: book.ratingCount || 0, // Provide a default value if ratingCount is missing
              price: book.bookPrice || 'N/A', // Provide a default value if price is missing
              originalPrice: book.originalPrice || 'N/A', // Provide a default value if originalPrice is missing
              bookDetails:book.bookDescription ||'N/A'
            }));
            this.filteredBooks = this.books.filter((book) =>
              book.title.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
          } else {
            console.error(
              'Expected an array in response.data but got:',
              response
            );
          }
        },
        (error) => {
          console.error('Error fetching books:', error);
        }
      );
    
  }



  filterBooks(): void {
    this.fetchBooks();
  }

  viewBookDetails(book: any): void {
    console.log(book);
    this.sharedService.updateSelectedBook(book);
    this.router.navigate(['/cart']);
  }


  fetchCartCount(): void {
    this.cartService.getCartById().subscribe(
      (response: any) => {
        if (response.success && Array.isArray(response.data)) {
          // Filter out items where isUnCarted or isOrdered is true
          const validItems = response.data.filter(
            (item: any) => !item.isOrdered && !item.isUnCarted
          );
          this.cartCount = validItems.length;
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

  updateFilteredBooks(): void {
    this.filteredBooks = this.books.filter((book) =>
      book.title.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
  
  

  }

 

