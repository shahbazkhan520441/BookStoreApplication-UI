import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private httpClient: HttpClient) {}

  // // Post service
  // postService(url: string, data: any): Observable<any> {
  //   console.log('in post service')
  //   return this.httpClient.post(url, data, {
  //     withCredentials: true, // Ensures cookies are sent
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //     }),
  //   });
  // }

  postService(url: string, data: any): Observable<any> {
    console.log('Sending request to URL:', url);
    console.log('Request Data:', data);
  
    return this.httpClient.post(url, data, {
      withCredentials: true,
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    }).pipe(
      catchError((error) => {
        console.error('Error in HTTP request:', error);
        return throwError(() => new Error('Error in postService'));
      })
    );
  }

  postServiceLoginLogout(url: string): Observable<any> {
    console.log('in post service logout in httpservice')
    console.log(url)
    return this.httpClient.post(url,null,{
      withCredentials: true, // Ensures cookies are sent
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  getService(url: string): Observable<any> {
    return this.httpClient.get(url, {
      withCredentials: true, // Ensures cookies are sent
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  // getServices(): Observable<any> {
  //   return this.httpClient.get("http://localhost:8080/api/v1/books", {
  //     withCredentials: true, // Ensures cookies are sent
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //     }),
  //   });
  // }
  

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

  deleteServiceRequest(url: string, data: any): Observable<any> {
    const options = {
      body: data, // Add the body to the options
      withCredentials: true, // Ensures cookies are sent
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.httpClient.request('DELETE', url, options);
  }
  



}