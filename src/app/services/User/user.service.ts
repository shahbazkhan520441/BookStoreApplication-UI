import { Injectable } from '@angular/core';
import { HttpService } from '../Http/http.service';
import { Observable } from 'rxjs';
import { OtpVerificationResponse } from 'src/app/models/otp-verification-response.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  url: string = 'http://localhost:8080'; // Base URL for API calls

  constructor(private httpServices: HttpService) {}

  // Login API call
  logInApiCall(endpoint: string, data: any): Observable<any> {
    console.log(data);
    return this.httpServices.postService(`${this.url}/api/v1/login`, data);
  }

 logOut(){
  return this.httpServices.postServiceLoginLogout("http://localhost:8080/api/v1/logout");
 }

  RefreshLogin(){
    console.log('in refresh login')

    return this.httpServices.postServiceLoginLogout(`${this.url}/api/v1/refreshLogin`)
  }

  // Sign Up API call
  signUpApiCall(endpoint: string, data: any): Observable<any> {
    console.log(data);
    return this.httpServices.postService(`${this.url}/api/v1/customers/register`, data);
  }

  // OTP verification API call
  verifyOtp(data: any): Observable<OtpVerificationResponse> {
    console.log('Hello World');
    console.log(data);
    return this.httpServices.postService(

      `${this.url}/api/v1/users/otpVerification`,
      data
    );
  }
}
