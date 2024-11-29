import { Injectable } from '@angular/core';
import { HttpService } from '../Http/http.service';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  url:string='http://localhost:8080';

  constructor(private httpService:HttpService) { }

  getAllBooks(){
    return this.httpService.getService('http://localhost:8080/api/v1/books')
  }
  
}
