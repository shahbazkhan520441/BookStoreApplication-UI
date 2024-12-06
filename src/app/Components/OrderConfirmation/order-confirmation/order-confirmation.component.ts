import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from 'src/app/services/Order/order.service';

@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.scss']
})
export class OrderConfirmationComponent implements OnInit {
 

  orderId: number | undefined;
  address: string | undefined;

  constructor(private router: Router, private orderService: OrderService) {}
  continue() {
    this.router.navigateByUrl('');
  }

  ngOnInit() {
    this.orderService.getOrder().subscribe((response) => {
      console.log(response);
      if (response && response.data && response.data.length > 0) {
        const order = response.data[response.data.length - 1]; // Get the last placed order
        this.orderId = order.orderId;
        this.address =
          order.addressDto.streetAddressAdditional + ', ' +
          order.addressDto.city + ', ' +
          order.addressDto.state;
      }
    });
  }
  

}
