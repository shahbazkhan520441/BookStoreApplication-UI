import { Injectable } from '@angular/core';
import { HttpService } from '../Http/http.service';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  url:string='https://localhost:8080';

  constructor(private httpService:HttpService) { }

  getAllBooks(){
    return this.httpService.getService(this.url+'/api/v1/books')
  }
}
