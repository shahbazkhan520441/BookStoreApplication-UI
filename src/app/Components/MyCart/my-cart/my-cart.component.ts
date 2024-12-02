import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CartService } from 'src/app/services/Cart/cart.service';
import { SharedService } from 'src/app/services/Shared/shared.service';
import { AddressService } from 'src/app/services/Address/address.service';
import { OrderService } from 'src/app/services/Order/order.service';

@Component({
  selector: 'app-my-cart',
  templateUrl: './my-cart.component.html',
  styleUrls: ['./my-cart.component.scss'],
})
export class MyCartComponent {
  isClicked: boolean = false;
  userName: string | null = null;
  cartCount: number = 0;
  quantity: number = 1;
  cartItems: any[] = [];
  showAddressSection = false;
  newAddress: any = null;
  location: string = '';
  @ViewChild('addressSection') addressSection!: ElementRef;
  constructor(
    private router: Router,
    private cartService: CartService,
    private sharedService: SharedService,
    private matSnackBar: MatSnackBar,
    private httpClient: HttpClient,
    private addressService: AddressService,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    this.getCartItems();
  }

  toggleClick(): void {
    this.isClicked = !this.isClicked;
  }
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
  logout(): void {
     // Clear localStorage and sessionStorage
  localStorage.clear();
  sessionStorage.clear();

    this.router.navigateByUrl('');
  }

  changeQuantity(change: number): void {
    if (this.quantity + change > 0) {
      this.quantity += change;
    }
  }

  getCartItems(): void {
    this.cartService.getCartById().subscribe(
      (response: any) => {
        console.log(response);
        // Check if the response is successful and contains a data array
        if (Array.isArray(response.data)) {

          console.log(response.data)
          // Initialize an empty array to store valid cart items
          const validItems = [];
          for (const item of response.data) {
            if (item.book.availabilityStatus === "YES") {
              validItems.push(item);
            }
          }
          console.log(validItems)
          this.cartItems = validItems;
          this.cartCount = this.cartItems.length;
          console.log(this.cartCount)
        } else {
          console.error('Unexpected response format:', response);
        }
      },
      (error) => {
        console.error('Error fetching cart items:', error);
      }
    );
  }

  // fetchCartCount(): void {
  //   this.cartService.getCartById().subscribe(
  //     (response: any) => {
  //       if (response.success && Array.isArray(response.data)) {
  //         // Filter out items where isUnCarted or isOrdered is true
  //         const validItems = response.data.filter(
  //           (item: any) => !item.isOrdered && !item.isUnCarted
  //         );
  //         this.cartCount = validItems.length;
  //       } else {
  //         console.error('Unexpected response format:', response);
  //         this.cartCount = 0;
  //       }
  //     },
  //     (error) => {
  //       console.error('Error fetching cart count:', error);
  //     }
  //   );
  // }

  fetchCartCount(): void {
    this.cartService.getCartById().subscribe(
      (response: any) => {
        if (response && Array.isArray(response.data)) {
          // Filter out items where isUnCarted or isOrdered is true
          console.log(response.data)
          const validItems = response.data
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

  useCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          this.location = `Lat: ${latitude}, Lon: ${longitude}`;
          alert(`Your current location is: ${this.location}`);
        },
        (error) => {
          console.error('Error fetching location', error);
          alert('Unable to retrieve location. Please try again.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }

  unCart(cartId: any): void {
    this.cartService.unCart(cartId).subscribe(
      (response: any) => {
        if (response.success) {
          this.matSnackBar.open('Item removed from cart', 'Close', {
            duration: 3000,
          });
          this.getCartItems(); // Refresh the cart items list
        } else {
          console.error('Failed to remove item from cart:', response.message);
          this.matSnackBar.open('Failed to remove item from cart', 'Close', {
            duration: 3000,
          });
        }
      },
      (error) => {
        console.error('Error removing item from cart:', error);
        this.matSnackBar.open('Error removing item from cart', 'Close', {
          duration: 3000,
        });
      }
    );
  }
  // Method to handle checkout button click
  onAddAdress() {
    this.showAddressSection = true;
    setTimeout(() => {
      this.scrollToAddressSection();
    }, 0);
  }

  // Method to scroll to the address section
  scrollToAddressSection() {
    this.addressSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  onSubmit(form: NgForm) {
    const addressData = {
      name: form.value.name,
      mobileNumber: form.value.mobileNumber,
      address: form.value.address,
      city: form.value.city,
      state: form.value.state,
      type: Number(form.value.type),
    };
    if (form.valid) {
      this.addressService.addAddress(addressData).subscribe(
        (response) => {
          this.matSnackBar.open('Address Added Successfully', '', {
            duration: 3000,
          });
        },
        (error) => {
          console.error('Error adding address:', error);
          this.matSnackBar.open('Unsccessfull in Adding Address', '', {
            duration: 3000,
          });
        }
      );
    }
  }

  onCheckout(): void {
    if (this.newAddress) {
      // If a new address is added, use it directly for the order
      const orderData = {
        items: this.cartItems,
        address: this.newAddress,
      };
      this.placeOrder(orderData);
    } else {
      // Otherwise, use the existing address
      this.addressService.getAddress().subscribe(
        (response: any) => {
          if (response && response.data && response.data.length > 0) {
            const orderData = {
              items: this.cartItems,
              address: response.data[0],
            };
            this.placeOrder(orderData);
          } else {
            this.matSnackBar.open(
              'Please add an address before checkout.',
              'Close',
              {
                duration: 3000,
              }
            );
            this.onAddAdress();
          }
        },
        (error) => {
          console.error('Error checking address:', error);
          this.matSnackBar.open(
            'Error checking address. Please try again.',
            'Close',
            {
              duration: 3000,
            }
          );
        }
      );
    }
  }

  placeOrder(orderData: any): void {
    const orders = orderData.items.map((item: any) => ({
      addressId: orderData.address.addressId,
      bookId: item.bookId,
    }));

    this.orderService.order(orders).subscribe(
      (response: any) => {
        if (response.success) {
          this.matSnackBar.open('Order placed successfully', 'Close', {
            duration: 3000,
          });

          this.cartItems.forEach((item) => {
            this.unCart(item.cartId);
          });
          this.router.navigateByUrl('/orderConfirmation');
        } else {
          this.matSnackBar.open('Failed to place order', 'Close', {
            duration: 3000,
          });
        }
      },
      (error) => {
        console.error('Error placing order:', error);
        this.matSnackBar.open('Error placing order', 'Close', {
          duration: 3000,
        });
      }
    );
  }
}
