
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BookService } from 'src/app/services/Book/book.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  books: any[]=[];
  cartCount:number=0;
  filteredBooks:any[]=[];
  searchQuery:string='';
  
  constructor(private bookService:BookService){};

  ngOnInit(){
    this.fetchBooks();
  }

  fetchBooks(): void {
    if (localStorage.getItem('token') != null) {
      this.bookService.getAllBooks().subscribe(
        (response: any) => {
          if (response && Array.isArray(response.data)) {
            this.books = response.data.map((book: any) => ({
              id: book.bookId,
              image: book.bookImage, // Map bookImage to image
              title: book.bookName, // Map bookName to title
              author: book.authorName, // Map authorName to author
              rating: book.rating || 'N/A', // Provide a default value if rating is missing
              ratingCount: book.ratingCount || 0, // Provide a default value if ratingCount is missing
              price: book.price || 'N/A', // Provide a default value if price is missing
              originalPrice: book.originalPrice || 'N/A', // Provide a default value if originalPrice is missing
            }));
            this.filteredBooks = this.books.filter((book) =>
              book.title.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
          } else {
            console.error(
              'Expected an array in response.data but got:',
              response
            );
          }
        },
        (error) => {
          console.error('Error fetching books:', error);
        }
      );
    }
  }
  

  }

 

