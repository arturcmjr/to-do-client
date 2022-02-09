import { Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@shared/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent {
  public loginForm = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required]),
  });
  public errorText: string | null = null;
  public isLoading = false;

  constructor(private auth: AuthService, private router: Router) {}

  public submit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    const { email, password } = this.loginForm.value;
    this.auth.login(email, password).subscribe({
      next: (value) => {
        this.isLoading = false;
        this.errorText = null;
        this.router.navigate(['/tasks']);
      },
      error: (error: string) => {
        this.errorText = error;
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
