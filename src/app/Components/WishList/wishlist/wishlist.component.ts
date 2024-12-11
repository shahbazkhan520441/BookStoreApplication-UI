import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnInit } from '@angular/core';
import { WishlistService } from 'src/app/services/Wishlist/wishlist.service';
import { CartService } from 'src/app/services/Cart/cart.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss'],
})
export class WishlistComponent implements OnInit {

  wishlistItems: any[] = [];

  id: number | null = null;
  book: any;
  quantity: number = 1;

  
  wishlistCount: number = 0;
Math: any;
  constructor(
    private wishlistService: WishlistService,
    private snackBar: MatSnackBar,
    private cartService :CartService
  ) {}
  ngOnInit(): void {
    this.getWishlist();
  }

  getWishlist() {
    this.wishlistService.getWishList().subscribe((response: any) => {
      console.log(response);
      // Assigning books to wishlistItems
      this.wishlistItems = response.data.books;
      
      // Mapping the items to include the discounted price
      this.wishlistItems = this.wishlistItems.map(item => ({
        ...item,
        discountedPrice: Math.round(item.bookPrice * (1 - item.discount / 100)) // Adding the discounted price
      }));
  
      console.log(this.wishlistItems);
      // Setting the wishlistCount to the length of the wishlistItems array
      this.wishlistCount = this.wishlistItems.length;
    });
  }
  

  removeFromWishlist(bookId: number) {
    this.wishlistService.removeWishlistItem(bookId).subscribe(() => {
      this.snackBar.open('Item removed from wishlist successfully!', 'Close', {
        duration: 3000, // Duration the snackbar is shown (in milliseconds)
        verticalPosition: 'top', // Position of the snackbar on the screen
        horizontalPosition: 'center', // Position of the snackbar on the screen
      });
      this.getWishlist();
    });
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

  addToCart(item: any): void {
    console.log(item);
  
    if (item) {
      // Extract the user ID from local storage
      this.extractUserId();
  
      // Structure the data to send to the cart service
      const cartData = {
        userid: this.id,             // User ID
        selectedQuantity: this.quantity, // Default quantity or user-selected quantity
        book: item,                  // Pass the entire book object
      };
  
      // Call the cart service to add the item to the cart
      this.cartService.addToCart(cartData).subscribe({
        next: (response) => {
          console.log('Cart added successfully:', response);
  
          // Show success message in snackbar
          this.snackBar.open('Item added to cart successfully!', '', {
            duration: 3000,
            verticalPosition: 'top',   // Optional positioning for the snackbar
            horizontalPosition: 'center', // Optional positioning for the snackbar
          });
  
          // Optionally update UI or navigate to cart page
          // this.goToCart();  // Uncomment if navigation to cart is required
        },
        error: (error) => {
          console.error('Error adding to cart:', error);
  
          // Show error message in snackbar
          this.snackBar.open('Failed to add item to cart. Please try again.', '', {
            duration: 3000,
          });
        },
      });
    } else {
      console.error('No item provided for adding to cart.');
      this.snackBar.open('No item selected to add to cart.', '', {
        duration: 3000,
      });
    }
  }
  

}