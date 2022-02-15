import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from '@env';
import { AuthService } from '@shared/services/auth/auth.service';
import { MockAuthService } from '@shared/services/auth/auth.service.spec';

import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [RegisterComponent],
      providers: [{ provide: AuthService, useClass: MockAuthService }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the page name on title', () => {
    expect(document.title).toBe('Register');
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

  it('should show password length error', () => {
    const password = component.registerForm.get('password');
    password?.setValue('123');
    password?.markAllAsTouched();
    fixture.detectChanges();
    const text = document.getElementsByTagName('mat-error')[0].textContent;
    expect(text).toContain('must have at least 6 characters');
  });

  it('should show password match error', () => {
    const { password, confirmPassword } = component.registerForm.controls;
    password?.setValue('123456');
    confirmPassword?.setValue('654321');
    confirmPassword?.markAllAsTouched();
    fixture.detectChanges();
    const text = document.getElementsByTagName('mat-error')[0].textContent;
    expect(text).toBe('passwords do not match');
  });

  it('should show invalid email error', () => {
    const email = component.registerForm.get('email');
    email?.setValue('invalid_email');
    email?.markAllAsTouched();
    fixture.detectChanges();
    const text = document.getElementsByTagName('mat-error')[0].textContent;
    expect(text).toBe('email must be valid');
  });

  it('should navigate to tasks when registered in', () => {
    const { email, password, confirmPassword } = component.registerForm.controls;
    email.setValue('not_cool@dude.com');
    password.setValue('letmein');
    confirmPassword.setValue('letmein');

    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigate');

    component.submit();
    expect(navigateSpy).toHaveBeenCalledWith(['/tasks']);
  });
});
