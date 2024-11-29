import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private httpClient: HttpClient) {}

  // Post service
  postService(url: string, data: any): Observable<any> {
    return this.httpClient.post(url, data, {
      withCredentials: true, // Ensures cookies are sent
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  getService(url: string): Observable<any> {
    return this.httpClient.get("http://localhost:8080/api/v1/books", {
      withCredentials: true, // Ensures cookies are sent
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  getServices(): Observable<any> {
    return this.httpClient.get("http://localhost:8080/api/v1/books", {
      withCredentials: true, // Ensures cookies are sent
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }
  

  // Put service
  putService(url: string, data: any): Observable<any> {
    return this.httpClient.put(url, data, {
      withCredentials: true, // Ensures cookies are sent
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  // Delete service
  deleteService(url: string): Observable<any> {
    return this.httpClient.delete(url, {
      withCredentials: true, // Ensures cookies are sent
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }
}
