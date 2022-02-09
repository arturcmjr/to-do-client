import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from '@shared/services/auth/auth.service';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: [
    './recover-password.component.scss',
    '../login/login.component.scss',
  ],
})
export class RecoverPasswordComponent implements OnInit {
  public emailControl = new FormControl(null, [
    Validators.email,
    Validators.required,
  ]);
  public errorText: string | null = null;
  public emailSent: boolean = false;
  public countDownTimer: number = 0;
  public isLoading = false;

  constructor(private auth: AuthService) {}

  ngOnInit(): void {}

  public formHasError(error?: string): boolean {
    const control = this.emailControl;
    return (
      (control.touched || control.dirty) &&
      (error ? control.hasError(error) : control.invalid)
    );
  }

  public submit(): void {
    if (this.emailControl.invalid) {
      this.emailControl.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    const email = this.emailControl.value;
    this.auth.sendRecoverEmail(email).subscribe({
      next: () => {
        this.emailSent = true;
        this.startCountDown();
        this.isLoading = false;
        this.errorText = null;
      },
      error: (error: string) => {
        this.errorText = error;
        this.isLoading = false;
      },
    });
  }

  public startCountDown() : void {
    this.countDownTimer = 60;
    const interval = window.setInterval(() => {
      this.countDownTimer--;
      if(this.countDownTimer <= 0) window.clearInterval(interval);
    },1000);
  }
}
