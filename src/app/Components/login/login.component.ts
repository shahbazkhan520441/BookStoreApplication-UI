import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/User/user.service';
import { NoSpaceValidator } from 'src/app/validator/noSpace.validators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedService } from 'src/app/services/Shared/shared.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  registerForm!: FormGroup;
  submitted = false;
  showPass = "text";

  constructor(private formBuilder: FormBuilder, public UserService: UserService, private router: Router,private snackbar: MatSnackBar,private sharedService :SharedService) {}

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, NoSpaceValidator.noSpaceValidations]], // Wrap in an array
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // Convenience getter for easy access to form fields
  get regFormControls() { 
    return this.registerForm.controls; 
  }

  handelLogin() {
    this.submitted = true;

    // Stop here if the form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    // Extract username and password values
    const { username, password } = this.registerForm.value;

    // Make API call
    this.UserService.logInApiCall('', { username, password }).subscribe({
      next: (res) => {
        console.log(res);
        this.snackbar.open('Login Successful', '', { duration: 3000 });

      // Response contains data with accessExpiration in seconds
const authResponse = res.data; // Access the data from the response

// Extracting the accessExpiration (in seconds) from the response
const accessExpirationInSeconds = authResponse.accessExpiration;
console.log('Access Expiration (seconds):', accessExpirationInSeconds);

// Get the current time in milliseconds
const currentTimeInMilliseconds = new Date().getTime();

// Calculate expiration time (current time + access expiration time in milliseconds)
const accessExpirationInMilliseconds = currentTimeInMilliseconds + (accessExpirationInSeconds * 1000);
console.log('Access Expiration (milliseconds):', accessExpirationInMilliseconds);

// Store the accessExpiration time in sessionStorage
sessionStorage.setItem('accessExpiration', accessExpirationInMilliseconds.toString());
 const username1=authResponse.username
 console.log(username1)
sessionStorage.setItem('username',authResponse.username.toString())

console.log(sessionStorage.getItem('username'))


     this.sharedService.updateLoginStatus(true);
     
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.snackbar.open('Login Unsuccessful: invalid credantial', '', {
          duration: 3000,
        });
        console.log(err);
      }
    });
  }
}
