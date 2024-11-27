import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/User/user.service';
import { NoSpaceValidator } from 'src/app/validator/noSpace.validators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  registerForm!: FormGroup;
  submitted = false;
  showPass = "text";

  constructor(private formBuilder: FormBuilder, public UserService: UserService, private router: Router) {}

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
        this.router.navigate(['/dashboard/notes']);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}
