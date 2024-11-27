import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private loginSubject = new BehaviorSubject<boolean>(false);
  loginStatus$ = this.loginSubject.asObservable();

  private selectedBookSubject = new BehaviorSubject<any>(null);
  selectedBook$ = this.selectedBookSubject.asObservable();

  private searchQuerySource = new BehaviorSubject<string>('');
  searchQuery$ = this.searchQuerySource.asObservable();

  updateLoginStatus(status: boolean) {
    this.loginSubject.next(status);
  }

  updateSelectedBook(book: any) {
    this.selectedBookSubject.next(book);
  }

  updateSearchQuery(query: string) {
    this.searchQuerySource.next(query);
  }
 
}
