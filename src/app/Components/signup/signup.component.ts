import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'; // Import Router for navigation
import { OtpVerificationResponse } from '../../models/otp-verification-response.interface'; // Import the interface
import { UserService } from 'src/app/services/User/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {

  
  registerForm!: FormGroup;
    submitted = false;
    showPass="text"

    otpForm!:FormGroup;
     otpSent = false; // Flag to check if OTP is sent
  otpValid = false; // Flag to check if OTP is valid
  otpErrorMessage = ''; // Store OTP error message

    constructor(private formBuilder: FormBuilder,public userService:UserService, private router: Router) { }

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
           
          firstName: ['', Validators.required],
          lastName: ['', Validators.required],
          email:['', Validators.required, Validators.email],
          password:['',[Validators.required,Validators.minLength(6)]],
          dob:["", Validators.required]
            
        
        });

          // Initialize OTP verification form
    this.otpForm = this.formBuilder.group({
      otp: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]]
    });

    }

  

    // convenience getter for easy access to form fields
    get regFormControls() { return this.registerForm.controls; }
    get otpFormControls() { return this.otpForm.controls; }

    onSubmit(){
     

      // stop here is form is invalid
      if((this.registerForm.invalid)){
        return;
      }

      // console.log(this.registerForm.controls["email"]["errors"]?.["required"])
      if(!this.registerForm.errors){
        const {firstName,lastName,dob,email,password} =this.registerForm.value
        console.log(firstName,lastName,dob,email,password)
        this.userService.signUpApiCall('',{firstName:firstName,lastName:lastName,dob:dob,email:email,password:password}).subscribe(
       {
        next: (res) => {
          console.log(res);
          if (res.message === "Otp sended") {
            console.log("Message is Otp sended");
            this.otpSent = true;
          } 
        },
        error:(err)=>{
          console.log(err);
        }

       }
        )

      }


     
    }



// ----------------------------------------------------------
    // Function to verify OTP
  // verifyOtp() {
  //   const otp = this.otpForm.value.otp;

  //   this.httpService.verifyOtpApiCall('', { email: this.registerForm.value.email, otp }).subscribe({
  //     next: (res) => {
  //       // if (res.success) {
  //       //   this.otpValid = true; // OTP verified successfully
  //       // } else {
  //       //   this.otpErrorMessage = 'Invalid OTP, please try again.';
  //       // }
  //     },
  //     error: (err) => {
  //       console.log(err);
  //       this.otpErrorMessage = 'An error occurred while verifying OTP.';
  //     }
  //   });

  // }


  // Submit OTP form
  onOtpSubmit() {
    if (this.otpForm.invalid) {
      return;
    }
     const otp = this.otpForm.value.otp;

    this.userService.verifyOtp({ email: this.registerForm.value.email, otp }).subscribe({
      next: (res: OtpVerificationResponse) => {
        console.log(res)
        console.log(res.data)
        if (res.data && res.data.success) {
          alert("account created sucessfully")
          // Redirect to login page after successful OTP verification
          this.router.navigate(['']);
        } else {

          alert("OTP Verification Failed")
          console.log('OTP Verification Failed');
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }


}
