import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/User/user.service';
import { NoSpaceValidator } from 'src/app/validator/noSpace.validators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedService } from 'src/app/services/Shared/shared.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { REMINDER_ICON, COLLABRATOR_ICON, COLOR_PALATTE_ICON, IMG_ICON, ARCHIVE_ICON, MORE_ICON, DELETE_FOREVER_ICON, RESTORE_ICON, UNARCHIVE_ICON, SHOW_PASS_ICON, HIDE_PASS_ICON } from 'src/assets/svg-icons';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  registerForm!: FormGroup;
  submitted = false;

  hide = true;


  constructor(private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer,private formBuilder: FormBuilder, public UserService: UserService, private router: Router,private snackbar: MatSnackBar,private sharedService :SharedService  ) {
    iconRegistry.addSvgIconLiteral('SHOW_PASS_ICON', sanitizer.bypassSecurityTrustHtml(SHOW_PASS_ICON));
    iconRegistry.addSvgIconLiteral('HIDE_PASS_ICON', sanitizer.bypassSecurityTrustHtml(HIDE_PASS_ICON));
   
  }

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
localStorage.setItem('userId',authResponse.userId)
localStorage.setItem('userRole',authResponse.userRole.toString())
console.log(authResponse.userId)
console.log(authResponse.userRole)

console.log(sessionStorage.getItem('username'))


     this.sharedService.updateLoginStatus(true);
     
        this.router.navigate(['']);
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
