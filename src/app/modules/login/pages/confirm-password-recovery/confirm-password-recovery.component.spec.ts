import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
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
      imports: [RouterTestingModule, ReactiveFormsModule, FormsModule],
      declarations: [ConfirmPasswordRecoveryComponent],
      providers: [{ provide: ActivatedRoute, useValue: { queryParams } }],
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

  it('should display the page title', () => {
    expect(document.title).toBe('Password Recovery');
  });

  it('should have the app name', () => {
    let titleContent: string = window
      .getComputedStyle(
        fixture.debugElement.nativeElement.querySelector('.app-title'),
        ':after'
      )
      .getPropertyValue('content');
    titleContent = titleContent.replace(/['"]+/g, '');
    expect(titleContent).toBe(environment.appName);
  });

  it('should show page title next to app name', () => {
    const el = document.getElementsByClassName('page-title')[0];
    expect(el.textContent).toBe('password recovery');
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
    const el = document.getElementsByTagName('mat-error')[0].textContent;
    expect(el).toBe('Parameters are not valid');
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
    const el = document.getElementsByTagName('mat-error')[0].textContent;
    expect(el).toContain('must have at least 6 characters');
  });
});
