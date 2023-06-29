import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { IUserRegister } from 'src/app/shared/interfaces/IUserRegister';
import { PasswordsMatchValidator } from 'src/app/shared/validators/password_match_validator';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit {
  registerForm!: FormGroup
  isSubmited = false;
  returnUrl = ''

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(5)]],
      name: ['', [Validators.required, Validators.minLength(5)]],
      address: ['', Validators.required]
    }, {
      Validators: PasswordsMatchValidator('password', 'confirmPassword')
    });
    this.returnUrl = this.activatedRoute.snapshot.queryParams.returnUrl;

  }
  get formControl() {
    return this.registerForm.controls;
  }

  submit() {
    this.isSubmited = true;
    if (this.registerForm.invalid) return;
    const formValues = this.registerForm.value;

    const user: IUserRegister = {
      email: formValues.email,
      password: formValues.password,
      confirmPassword: formValues.confirmPassword,
      name: formValues.name,
      address: formValues.address
    }
    this.userService.register(user).subscribe(() => {
      this.router.navigateByUrl(this.returnUrl);
    })

    console.log(user)
    console.log("Submit values email", this.formControl.email.value)
    console.log("Submit values password", this.formControl.password.value)
    console.log("Submit values confirmPassword", this.formControl.confirmPassword.value)
    console.log("Submit values name", this.formControl.name.value)
    console.log("Submit values address", this.formControl.address.value)


  }
}
