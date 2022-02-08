import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '@shared/services/auth/auth.service';
import { passwordMatch } from '@shared/helpers/validators/password-match';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss', '../login/login.component.scss'],
})
export class RegisterComponent implements OnInit {
  public registerForm = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required]),
    confirmPassword: new FormControl(null, [
      Validators.required,
      passwordMatch,
    ]),
  });
  public errorText: string | null = null;
  public isLoading = false;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    const { confirmPassword, password } = this.registerForm.controls;
    password?.valueChanges.subscribe(() => {
      confirmPassword.updateValueAndValidity();
    });
  }

  public formHasError(controlName: string, error?: string): boolean {
    const control = this.registerForm.controls[controlName];
    return (
      (control.touched || control.dirty) &&
      (error ? control.hasError(error) : control.invalid)
    );
  }

  public submit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    const { email, password } = this.registerForm.value;
    this.auth.register(email,password).subscribe({next: () => {
      this.router.navigate(['/tasks']);
      this.isLoading = false;
      this.errorText = null;
    },error: (error: any) => {
      this.isLoading = false;
      this.errorText = error.errorCode;
      // TODO: show error
    }});
  }
}
