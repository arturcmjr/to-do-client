import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from '@env';
import { By } from '@angular/platform-browser';
import { AuthService } from '@shared/services/auth/auth.service';
import { Router } from '@angular/router';
import { MockAuthService } from '@shared/services/auth/auth.service.spec';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [RouterTestingModule],
      providers: [{ provide: AuthService, useClass: MockAuthService }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the page name on title', () => {
    expect(document.title).toBe('Login');
  });

  it('should display the app name', () => {
    let titleContent: string = window
      .getComputedStyle(
        fixture.debugElement.nativeElement.querySelector('.app-title'),
        ':after'
      )
      .getPropertyValue('content');
    titleContent = titleContent.replace(/['"]+/g, '');
    expect(titleContent).toBe(environment.appName);
  });

  it('should call submit', () => {
    spyOn(component, 'submit');
    let form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('submit', null);
    fixture.detectChanges();
    expect(component.submit).toHaveBeenCalled();
  });

  it('form should be invalid when empty', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('should navigate to tasks when logged in', () => {
    const { email, password } = component.loginForm.controls;
    email.setValue('test@example.com');
    password.setValue('letmein');

    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigate');

    component.submit();
    expect(navigateSpy).toHaveBeenCalledWith(['/tasks']);
  });

  it('should show login error', () => {
    const { email, password } = component.loginForm.controls;
    email.setValue('test@example.com');
    password.setValue('don\'tletmein');
    component.submit();
    fixture.detectChanges();

    const error = document.getElementsByTagName('mat-error')[0];
    expect(error.textContent).toBe(component.errorText);
  });

  it('should show invalid email error', () => {
    const email = component.loginForm.get('email');
    email?.setValue('invalid_email');
    email?.markAllAsTouched();
    fixture.detectChanges();
    const text = document.getElementsByTagName('mat-error')[0].textContent;
    expect(text).toBe('email must be valid');
  });
});
