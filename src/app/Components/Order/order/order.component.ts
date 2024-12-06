import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { OrderService } from 'src/app/services/Order/order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent {
  orders: any[] = [];

  constructor(private orderService: OrderService, private router: Router) {}

  ngOnInit() {
    this.getOrderData();
  }

  getOrderData() {
    this.orderService.getOrder().subscribe(
      (response: any) => {
        if (response && response.data) {
          this.orders = response.data.map((order: any) => {
            // Extract address information
            const addressDto = order.addressDto;
            const address = `${addressDto.streetAddress}, ${addressDto.streetAddressAdditional}, ${addressDto.city}, ${addressDto.state}, ${addressDto.country}, ${addressDto.pincode}`;
  
            // Extract book details (if available)
            const books = order.books.map((book: any) => ({
             
              bookImage: book.bookImage,
              bookTitle: book.bookName,
              bookAuthor: book.bookAuthor,
              bookPrice: book.bookPrice,
            }));
            console.log(books)
  
            return {
              orderId: order.orderId,
              totalQuantity: order.totalQuantity,
              totalPrice: order.totalPrice,
              discount: order.discount,
              discountPrice: order.discountPrice,
              totalPayableAmount: order.totalPayableAmount,
              address: address,
              books: books,
            };
          });
        }
      },
      (error) => {
        console.error('Error fetching orders:', error);
      }
    );
  }
  

  continue() {
    this.router.navigateByUrl('');
  }
}
