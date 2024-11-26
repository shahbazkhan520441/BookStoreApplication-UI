import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OtpVerificationResponse } from 'src/app/models/otp-verification-response.model';
import { UserResponseModel } from 'src/app/models/UserResponseModel';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(public http:HttpClient) { }

  logInApiCall(endpoint: String ,data: any){
    console.log(data)
  
    return this.http.post('http://localhost:8080/api/v1/login',data,  {
      withCredentials: true, // Allow cookies to be stored and sent with requests
      headers: new HttpHeaders({
          'Content-Type': 'application/json'
      })
  });
  }

  signUpApiCall(endpoint: String ,data: any){
    console.log(data)
  
    return this.http.post<UserResponseModel>('http://localhost:8080/api/v1/customers/register',data,  {
      withCredentials: true, // Allow cookies to be stored and sent with requests
      headers: new HttpHeaders({
          'Content-Type': 'application/json'
      })
  });
  }

    // OTP verification API
    verifyOtp(data: any): Observable<OtpVerificationResponse> {
      console.log('heelo world')
      console.log(data)
      return this.http.post<OtpVerificationResponse>('http://localhost:8080/api/v1/users/otpVerification', data);
    }

  // verifyOtp(data: any){
  //   console.log(data)
  
  //   return this.http.post('http://localhost:8080/api/v1/customers/register',data,  {
  //     withCredentials: true, // Allow cookies to be stored and sent with requests
  //     headers: new HttpHeaders({
  //         'Content-Type': 'application/json'
  //     })
  // });
  // }

}

// ----------------------------------------------------------------

// logInApiCall(endpoint: String ,data: any){
//   console.log(data)

//   return this.http.post('http://localhost:8080/api/v1/login', data, {
//     withCredentials:true,// Allow cookies to be stored in the browser
//     headers:new HttpHeaders({
//       'Content-Type': 'application/json'
//     })
//   });





// ----------------------------


// async loginSignupCall(endpoint: string, data: any): Promise<any> {
//   const headers = new HttpHeaders({
//     'Content-Type': 'application/json',
//   });

//   try {
//     const res = await this.http.post(this.baseUrl + endpoint, data, { headers }).toPromise()
//     return res
//   } catch (error) {
//     return error
//     }

//   }