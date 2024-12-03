import { Injectable } from '@angular/core';
import { HttpService } from '../Http/http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  url: string = 'http://localhost:8080/api/v1';

  customerId:number | undefined;
  addressId:number |undefined;
 constructor(private httpService: HttpService) {
   let userId = localStorage.getItem('userId');
   if (userId) {
     this.customerId = parseInt(userId);
     console.log(this.customerId);
   } else {
     console.error("User ID not found");
   }
 
 }





  order(data: any): Observable<any> {

    let addressId = localStorage.getItem('addressId');
    if (addressId) {
      this.addressId = parseInt(addressId);
      console.log(this.addressId);
    } else {
      console.error("User ID not found");
    }
  
    console.log(data);
    
      return this.httpService.postService(`${this.url}/customers/${this.customerId}/addresses/${this.addressId}/purchase-orders`, data);
    }
}
