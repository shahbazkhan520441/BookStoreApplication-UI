import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { CartService } from 'src/app/services/Cart/cart.service';
import { SharedService } from 'src/app/services/Shared/shared.service';
import { AddressService } from 'src/app/services/Address/address.service';
import { OrderService } from 'src/app/services/Order/order.service';
import { OrderRequest } from 'src/app/models/OrderRequest';

@Component({
  selector: 'app-my-cart',
  templateUrl: './my-cart.component.html',
  styleUrls: ['./my-cart.component.scss'],
})
export class MyCartComponent {

  addressForm!: FormGroup<{
    streetAddress: FormControl<string | null>;
    streetAddressAdditional: FormControl<string | null>;
    city: FormControl<string | null>;
    state: FormControl<string | null>;
    country: FormControl<string | null>;
    pincode: FormControl<number | null>;
    addressType: FormControl<string | null>;
  }>;
  
  
  addressTypes: string[] = ['OTHER', 'OFFICE', 'SHOP', 'HOME', 'INDUSTRY'];
  addressformsubmitted=false;
  isClicked: boolean = false;
  userName: string | null = null;
  cartCount: number = 0;
  quantity: number = 1;
  cartItems: any[] = [];
  showAddressSection = false;
  newAddress: any = null;
  location: string = '';

  // Variables for order summary
  originalPrice:number=0;
  totalQuantity: number = 0;
  totalPrice: number = 0;
  discount: number = 0; // You can replace this with actual logic for discounts
  totalPayableAmount: number = 0;

  isStepperVisible = false; // Track if stepper should be shown
  isAddressSubmitted = false; // Track if the address form is submitte
  @ViewChild('addressSection') addressSection!: ElementRef;
  constructor(
    private fb:FormBuilder,
    private router: Router,
    private cartService: CartService,
    private matSnackBar: MatSnackBar,
    private addressService: AddressService,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    this.getCartItems();

    this.addressForm = this.fb.group({
      streetAddress: ['', [Validators.required, Validators.maxLength(100)]],
      streetAddressAdditional: ['', [Validators.maxLength(100)]],
      city: ['', [Validators.required, Validators.maxLength(50)]],
      state: ['', [Validators.required, Validators.maxLength(50)]],
      country: ['', [Validators.required, Validators.maxLength(50)]],
      pincode: [0, [Validators.required, Validators.pattern(/^\d{5,6}$/)]],
      addressType: ['', Validators.required],
    });
  }

  get f() {
    return this.addressForm.controls;
  }
  onAddAddress() {
    this.isStepperVisible = true;
  }




  getErrorMessage(controlName: string): string {
    const control = this.addressForm.get(controlName);
    if (control?.hasError('required')) {
      return `${controlName} is required`;
    }
    if (control?.hasError('maxlength')) {
      const maxLength = control.getError('maxlength')?.requiredLength;
      return `${controlName} must not exceed ${maxLength} characters`;
    }
    if (control?.hasError('pattern')) {
      return `${controlName} is invalid`;
    }
    return '';
  }
  
  onSubmitAddress(): void {
    if (this.addressForm.valid) {
      const addressData = this.addressForm.value;
      console.log('Address Data:', addressData);
      this.newAddress=this.addressForm.value
      // Usage in your component
      this.addressService.addAddress(addressData).subscribe(
        (response) => {
          console.log('Response:', response);
          console.log(response.data.addressId)
          localStorage.setItem("addressId",response.data.addressId)

          this.addressformsubmitted=true
          this.matSnackBar.open('Address Added Successfully!', 'Close', {
            duration: 3000,
          });
        },
        (error) => {
          console.error('Error:', error);
          this.matSnackBar.open('Please fill out the form correctly.', 'Close', {
            duration: 3000,
          });
        }
      );
      } 
      else{
        console.log('invalid form ')

      }
  }
  toggleClick(): void {
    this.isClicked = !this.isClicked;
  }
  isLoggedIn(): boolean {
    return !!localStorage.getItem('accessToken');
  }

 
  logout(): void {
     // Clear localStorage and sessionStorage
  localStorage.clear();
  sessionStorage.clear();

  this.matSnackBar.open('logout sucefully.', 'Close', {
    duration: 3000,
  });
    
    this.router.navigateByUrl('');
  }

  changeQuantity(cartId: number, change: number): void {
    const cartItem = this.cartItems.find(item => item.cartId === cartId);
  
    if (cartItem && cartItem.selectedQuantity + change > 0) {
      cartItem.selectedQuantity += change;
  
      // Recalculate price for the updated quantity
      const discountPercentage = cartItem.book.discount || 0;
      console.log(discountPercentage)
      console.log(cartItem.book.discount)
      const originalPrice = cartItem.book.bookPrice;
      const discountAmount = (originalPrice * discountPercentage) / 100;
      const discountedPrice = originalPrice - discountAmount;
      cartItem.book.bookPrice = discountedPrice *cartItem.selectedQuantity;
  
      // Optionally, update the backend to reflect the change
      this.cartService.updateCartQuantity(cartId, cartItem.selectedQuantity).subscribe(
        (response: any) => {
          console.log(response);
          if (response.status === 200) {
            this.getCartItems(); // Refresh the cart items after the update
            this.matSnackBar.open('Quantity updated successfully', 'Close', {
              duration: 3000,
            });
          } else {
            console.error('Failed to update quantity:', response.message);
            this.matSnackBar.open('Failed to update quantity', 'Close', {
              duration: 3000,
            });
          }
        },
        (error) => {
          console.error('Error updating quantity:', error);
          this.matSnackBar.open('Error updating quantity', 'Close', {
            duration: 3000,
          });
        }
      );
    }
  }
  
  getCartItems(): void {
    this.cartService.getCartById().subscribe(
      (response: any) => {
        if (Array.isArray(response.data)) {
          console.log(response);
  
          // Filter out items that are not available
          const validItems = response.data.filter(
            (item: any) => item.book.availabilityStatus === 'YES'
          );
  
          // Initialize quantity for each cart item and apply discounts
          this.cartItems = validItems.map((item: any) => {

            this.originalPrice=item.book.bookPrice
            // Calculate the discounted price for the item
            const discountPercentage = item.book.discount || 0;
            const originalPrice = item.book.bookPrice;
            const totalQuantity=item.selectedQuantity
            const discountAmount = (originalPrice *  discountPercentage) / 100;
            const discountedPrice = originalPrice - discountAmount;
            item.book.bookPrice = discountedPrice * totalQuantity;
  
            // Initialize quantity (default to 1 if not set)
            item.selectedQuantity = item.selectedQuantity || 1;
            
            return item;
          });
  
          // Update the cart count
          this.cartCount = this.cartItems.length;
  
          // Recalculate the order summary whenever the cart is fetched
          this.calculateOrderSummary();
        } else {
          console.error('Unexpected response format:', response);
        }
      },
      (error) => {
        console.error('Error fetching cart items:', error);
      }
    );
  }
  
 


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

 

  unCart(cartId: any): void {
    this.cartService.unCart(cartId).subscribe(
      (response: any) => {
        console.log(response)
        if (response) {
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

  

  onCheckout(): void {


    if (this.newAddress) {
      // If a new address is added, use it directly for the order
      const orderData = {
        items: this.cartItems,
        address: this.newAddress,
      };
      this.placeOrder();
    } else {
      // Otherwise, use the existing address
      this.addressService.getAddress().subscribe(
        (response: any) => {
          if (response && response.data && response.data.length > 0) {
            const orderData = {
              items: this.cartItems,
              address: response.data[0],
            };
            this.placeOrder();
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


 

  placeOrder(): void {
    console.log(this.cartItems)
    if (this.cartItems.length === 0) {
      this.matSnackBar.open('Cart is empty. Please add items to your cart.', 'Close', {
        duration: 3000,
      });
      return;
    }
  
    // Calculate the values for the OrderRequest object
    const totalQuantity = this.cartItems.reduce((sum, item) => sum + item.selectedQuantity, 0);
    const totalPrice = this.cartItems.reduce((sum, item) => sum + item.book.bookPrice * item.selectedQuantity, 0);
    const discount = 0; // Replace with actual logic to calculate discount, if any
    const discountPrice = totalPrice - discount; // Adjust this logic as needed
    const totalPayableAmount = discountPrice;
  
    // Collect cart IDs
    const cartIds = this.cartItems.map(item => item.cartId);
  
    // Construct the OrderRequest object
    const orderRequest: OrderRequest = {
      totalQuantity,
      totalPrice,
      discount,
      discountPrice,
      totalPayableAmount,
      cartIds,
    };
  
    console.log('Order Request:', orderRequest);
  
    // Send the order request to the backend
    this.orderService.order(orderRequest).subscribe(
      (response: any) => {
        console.log(response)
        if (response) {
          this.matSnackBar.open('Order placed successfully', 'Close', {
            duration: 3000,
          });
  
          // Un-cart items after successful order
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

  calculateOrderSummary(): void {
    // Calculate total quantity and price
    this.totalQuantity = this.cartItems.reduce((sum, item) => sum + item.selectedQuantity, 0);
    this.totalPrice = this.cartItems.reduce((sum, item) => sum + this.originalPrice * item.selectedQuantity, 0);
  
    // Calculate the total discount and total payable amount
     this.discount = this.cartItems.reduce((totalDiscount, item) => {
      console.log(item.book.discount)
      const totalamount = this.originalPrice * item.selectedQuantity;
      const discountPercentage = item.book.discount || 0; // Use item's discount if available, otherwise 0
      const discountAmount = (totalamount * discountPercentage) / 100;
      return totalDiscount + discountAmount;
    }, 0);
  
    // Calculate total payable amount
    this.totalPayableAmount = this.totalPrice - this.discount;

    console.log(this.discount)
  }
  
  

}
