import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@shared/services/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent implements OnInit {
  public loginForm = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required]),
  });
  public errorText: string | null = null;
  public isLoading = false;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    // window.setInterval(() => {
    //   this.isLoading = !this.isLoading;
    //   this.count++;
    // },4000);
  }

  public submit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    const { email, password } = this.loginForm.value;
    this.auth.login(email, password).subscribe({
      next: (value) => {
        console.log(value);
        this.isLoading = false;
        this.errorText = null;
        this.router.navigate(['/tasks']);
      },
      error: (message) => {
        // snackBar.open(message.errorCode, undefined, { duration: 3000, panelClass: ['mat-toolbar', 'mat-warn'] });
        this.errorText = message.errorCode;
        this.isLoading = false;
      },
    });
  }

  public formHasError(controlName: string, error?: string): boolean {
    const control = this.loginForm.controls[controlName];
    return (
      (control.touched || control.dirty) &&
      (error ? control.hasError(error) : control.invalid)
    );
  }
}
