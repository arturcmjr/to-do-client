import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public loginForm = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required]),
  });
  public loginError: string | null = null;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {  }

  public submit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    const { email, password } = this.loginForm.value;
    const me = this;
    this.auth.login(email, password).subscribe({
      next: (value) => {
        console.log(value);
        this.router.navigate(["/todo"]);
      },
      error: (message) => {
        // snackBar.open(message.errorCode, undefined, { duration: 3000, panelClass: ['mat-toolbar', 'mat-warn'] });
        me.loginError = message.errorCode;
      },
    });
  }

  // private loginError(message: string): void {
  //   console.log(message);
  //   this.snackBar.open(message);
  // }

  public formHasError(controlName: string, error?: string): boolean {
    const control = this.loginForm.controls[controlName];
    return (
      (control.touched || control.dirty) &&
      (error ? control.hasError(error) : control.invalid)
    );
  }
}
