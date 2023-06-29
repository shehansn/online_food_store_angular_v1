import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  loginForm!: FormGroup
  isSubmited = false;
  returnUrl = ''

  constructor(private formBuilder: FormBuilder, private userService: UserService,
    private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    this.returnUrl = this.activatedRoute.snapshot.queryParams.returnUrl;

  }

  get formControl() {
    return this.loginForm.controls;
  }

  submit() {
    this.isSubmited = true;
    if (this.loginForm.invalid) return;

    console.log("Submit values email", this.formControl.email.value)
    console.log("Submit values password", this.formControl.password.value)

    this.userService.login({ email: this.formControl.email.value, password: this.formControl.password.value }).subscribe(() => {
      this.router.navigateByUrl(this.returnUrl);
    });

  }

}
