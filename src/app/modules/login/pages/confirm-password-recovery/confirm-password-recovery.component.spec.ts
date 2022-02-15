import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '@shared/services/auth/auth.service';
import { MockAuthService } from '@shared/services/auth/auth.service.spec';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

import { ConfirmPasswordRecoveryComponent } from './confirm-password-recovery.component';

describe('ConfirmPasswordRecoveryComponent', () => {
  let component: ConfirmPasswordRecoveryComponent;
  let fixture: ComponentFixture<ConfirmPasswordRecoveryComponent>;
  let queryParams: Subject<Params>;

  beforeEach(async () => {
    queryParams = new Subject<Params>();

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        FormsModule,
        RouterTestingModule,
      ],
      declarations: [ConfirmPasswordRecoveryComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { queryParams } },
        { provide: AuthService, useClass: MockAuthService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmPasswordRecoveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the page name on title', () => {
    expect(document.title).toBe('Password Recovery');
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
    component.userEmail = 'test@example.org';
    fixture.detectChanges();
    spyOn(component, 'submit');
    let form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('submit', null);
    fixture.detectChanges();
    expect(component.submit).toHaveBeenCalled();
  });

  it('should call validateCode', () => {
    spyOn(component, 'validateCode');
    queryParams.next({ mode: 'resetPassword', oobCode: 'some_code' });
    expect(component.validateCode).toHaveBeenCalled();
  });

  it('should call validateCode when query params are valid', () => {
    spyOn(component, 'validateCode');
    queryParams.next({ mode: 'resetPassword', oobCode: 'some_code' });
    expect(component.validateCode).toHaveBeenCalled();
  });

  it("should not call validateCode when query params aren't valid", () => {
    spyOn(component, 'validateCode');
    queryParams.next({
      mode: 'resetPassword',
      oobCode: null,
    });
    expect(component.validateCode).not.toHaveBeenCalled();
  });

  it("should show error when query params aren't valid", () => {
    queryParams.next({
      mode: 'otherAction',
      oobCode: 'some_code',
    });
    fixture.detectChanges();
    const text = document.getElementsByTagName('mat-error')[0].textContent;
    expect(text).toBe('Parameters are not valid');
  });

  it('form should be invalid when empty', () => {
    expect(component.confirmForm.valid).toBeFalsy();
  });

  it('should show password length error', () => {
    component.userEmail = 'email';
    const password = component.confirmForm.get('password');
    password?.setValue('123');
    password?.markAllAsTouched();
    fixture.detectChanges();
    const text = document.getElementsByTagName('mat-error')[0].textContent;
    expect(text).toContain('must have at least 6 characters');
  });

  it('should show password match error', () => {
    component.userEmail = 'email';
    const { password, confirmPassword } = component.confirmForm.controls;
    password?.setValue('123456');
    confirmPassword?.setValue('654321');
    component.confirmForm?.markAllAsTouched();
    fixture.detectChanges();
    const text = document.getElementsByTagName('mat-error')[0].textContent;
    expect(text).toBe('passwords do not match');
  });

  it('should show spinner while validating params', () => {
    const spinnerElement = document.getElementsByTagName('mat-spinner')[0];
    expect(spinnerElement).toBeTruthy();
  });

  it('should have a link to send email page when something goes wrong', () => {
    component.errorText = 'some error';
    fixture.detectChanges();
    const href = document
      .getElementsByClassName('bottom-link')[0]
      .getElementsByTagName('a')[0]
      .getAttribute('href');
    expect(href).toEqual('/recover-password');
  });

  it('should navigate to login when the password was successfully updated', () => {
    component.code = 'valid_code';
    const { password, confirmPassword } = component.confirmForm.controls;
    password.setValue('123456');
    confirmPassword.setValue('123456');

    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigate');

    component.submit();
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });

  it('should show confirmation error', () => {
    component.code = 'null';
    const { password, confirmPassword } = component.confirmForm.controls;
    password.setValue('123456');
    confirmPassword.setValue('123456');
    component.submit();
    fixture.detectChanges();

    const error = document.getElementsByTagName('mat-error')[0];
    expect(error.textContent).toBe(component.errorText);
  });
});
