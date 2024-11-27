import { Observable } from 'rxjs';
import { HttpService } from './../Http/http.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  url: string = 'https://localhost:7189';
  token: any;
  constructor(private httpService: HttpService) {
    this.token = localStorage.getItem('token');
  }
  addToCart(data: any): Observable<any> {
    const header = {
      'Content-type': 'application/json',
      Authorization: 'Bearer ' + this.token,
    };
    return this.httpService.postService(this.url + '/api/Cart', data);
  }

  getCartById(): Observable<any> {
    const header = {
      'Content-type': 'application/json',
      Authorization: 'Bearer ' + this.token,
    };
    return this.httpService.getService(this.url + '/GetCartByID');
  }

}