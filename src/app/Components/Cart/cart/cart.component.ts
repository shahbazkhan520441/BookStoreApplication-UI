import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/Cart/cart.service';
import { SharedService } from 'src/app/services/Shared/shared.service';
import { WishlistService } from 'src/app/services/Wishlist/wishlist.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {

  isAddedToCart: boolean = false;
  isAddedToWishlist:boolean=false;

  id: number | null = null;
  book: any;
  quantity: number = 1;

  feedback: string = ''; // Bind this property to the input field

  constructor(
    private sharedService: SharedService,
    private cartService: CartService,
    private matSnackBar: MatSnackBar,
    private wishlistService: WishlistService,
    private router: Router
  ) {}

 

  resetInput(): void {
    this.feedback = ''; // Reset the bound property
    console.log('Input field has been reset!');
  }

  ngOnInit() {
    this.sharedService.selectedBook$.subscribe((book) => {
      console.log(book)
      this.book = book;
    });
  }



  changeQuantity(change: number): void {
    if (this.quantity + change > 0) {
      this.quantity += change;
    }
  }

  extractUserId(): void {
    const userId  = localStorage.getItem('userId');
    if (userId) {
      try {
        this.id = parseInt(userId);
      } catch (error) {
        console.error('Failed to extract userId', error);
      }
    }
  }

  addToCart(): void {
    console.log(this.book)
    if (this.book) {
      this.extractUserId();
      const cartData = {
        userid: this.id,
        selectedQuantity: this.quantity,
        book: this.book,
      };
      this.cartService.addToCart(cartData).subscribe({
        next: (response) => {
          this.isAddedToCart = true;
          console.log('Cart added successfully:', response);
          this.matSnackBar.open('Cart Added Sucessfully', '', {
            duration: 3000,
          });
        },
        error: (error) => {
          console.error('Error adding to cart:', error);
          this.matSnackBar.open('Cart Added Sucessfully', '', {
            duration: 3000,
          });
        },
      });
    }
  }
  addToWishlist(): void {
    if (this.book) {
      console.log(this.book.bookid)
      const wishlistData = {
        
        bookId: this.book.bookid,
      };
      this.wishlistService.addToWishList(wishlistData).subscribe({
        next: (response) => {
          this.isAddedToWishlist=true;
          console.log('Added to wishlist successfully:', response);
          this.matSnackBar.open('Added to Wishlist Successfully', '', {
            duration: 3000,
          
          });
        },
        error: (error) => {
          console.error('Error adding to wishlist:', error);
          this.matSnackBar.open('Error adding to Wishlist', '', {
            duration: 3000,
          });
        },
      });

      
    }
  }

  goToCart() {
    this.router.navigate(['myCart'])
    console.log('Navigating to cart');
  }

  goToWishlist(){
    this.router.navigate(['wishlist'])
  }
  

}
