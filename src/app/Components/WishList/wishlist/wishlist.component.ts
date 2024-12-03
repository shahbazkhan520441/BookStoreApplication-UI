import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnInit } from '@angular/core';
import { WishlistService } from 'src/app/services/Wishlist/wishlist.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss'],
})
export class WishlistComponent implements OnInit {
  wishlistItems: any[] = [];
  wishlistCount: number = 0;
  constructor(
    private wishlistService: WishlistService,
    private snackBar: MatSnackBar
  ) {}
  ngOnInit(): void {
    this.getWishlist();
  }

  getWishlist() {
    this.wishlistService.getWishList().subscribe((response: any) => {
      console.log(response)
      this.wishlistItems = response.data.books;
      console.log(this.wishlistItems)
      this.wishlistCount = response.data.length;
    });
  }

  removeFromWishlist(wishlistId: number) {
    this.wishlistService.removeWishlistItem(wishlistId).subscribe(() => {
      this.snackBar.open('Item removed from wishlist successfully!', 'Close', {
        duration: 3000, // Duration the snackbar is shown (in milliseconds)
        verticalPosition: 'top', // Position of the snackbar on the screen
        horizontalPosition: 'center', // Position of the snackbar on the screen
      });
      this.getWishlist();
    });
  }
}
