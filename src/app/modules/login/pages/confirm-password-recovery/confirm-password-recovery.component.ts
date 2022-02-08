import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { passwordMatch } from '@shared/helpers/validators/password-match';
import { AuthService } from '@shared/services/auth/auth.service';

@Component({
  selector: 'app-confirm-password-recovery',
  templateUrl: './confirm-password-recovery.component.html',
  styleUrls: [
    './confirm-password-recovery.component.scss',
    '../login/login.component.scss',
  ],
})
export class ConfirmPasswordRecoveryComponent implements OnInit {
  public confirmForm = new FormGroup({
    password: new FormControl(null, [Validators.required]),
    confirmPassword: new FormControl(null, [
      Validators.required,
      passwordMatch,
    ]),
  });
  public errorText: string | null = null;
  public isLoading = false;
  public code?: string;
  public userEmail?: string;

  constructor(
    private auth: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    activatedRoute.queryParams.subscribe((params) => {
      const { mode, oobCode } = params || {};
      if (oobCode && mode === 'resetPassword') this.code = oobCode;
      // TODO: handle wrong info
      console.log({ mode, oobCode });
      this.validateCode();
    });
  }

  ngOnInit(): void {}

  public formHasError(controlName: string, error?: string): boolean {
    const control = this.confirmForm.controls[controlName];
    return (
      (control.touched || control.dirty) &&
      (error ? control.hasError(error) : control.invalid)
    );
  }

  public validateCode(): void {
    if (!this.code) return;
    this.auth.verifyPasswordResetCode(this.code).subscribe({
      next: (email) => {
        console.log(email);
        this.userEmail = email;
      },
      error: (error) => {
        this.errorText = error.errorCode;
        this.isLoading = false;
      },
    });
  }

  public submit(): void {
    if (!this.code) return;
    if (this.confirmForm.invalid) {
      this.confirmForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    const { password } = this.confirmForm.value;
    this.auth.confirmPasswordReset(password, this.code).subscribe({
      next: () => {
        this.router.navigate(['/login']);
        this.isLoading = false;
        this.errorText = null;
      },
      error: (error: any) => {
        this.isLoading = false;
        this.errorText = error.errorCode;
      },
    });
  }
}
