import {
  ComponentFixture,
  discardPeriodicTasks,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from '@env';
import { AuthService } from '@shared/services/auth/auth.service';
import { MockAuthService } from '@shared/services/auth/auth.service.spec';

import { RecoverPasswordComponent } from './recover-password.component';

describe('RecoverPasswordComponent', () => {
  let component: RecoverPasswordComponent;
  let fixture: ComponentFixture<RecoverPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [RecoverPasswordComponent],
      providers: [{ provide: AuthService, useClass: MockAuthService }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecoverPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the page name on title', () => {
    expect(document.title).toBe('Recover Password');
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

  it('should display message when email was sent', () => {
    component.emailControl.setValue('cool@dude.com');
    component.submit();
    fixture.detectChanges();
    const label = document.getElementsByTagName('p')[0]
      ?.firstChild as HTMLElement;
    expect(label?.textContent).toBe('Email sent, please check your inbox.');
  });

  it('should show the remaining seconds until resend be available', fakeAsync(() => {
    component.emailControl.setValue('cool@dude.com');
    component.submit();
    tick(25000);
    fixture.detectChanges();
    discardPeriodicTasks();
    const label = document.getElementsByTagName('p')[0].children[2] as HTMLElement;
    expect(label.textContent).toContain(`If you don't receive it in ${component.countDownTimer} please, try again.`);
  }));

  it('should display error when email was not sent', () => {
    component.emailControl.setValue('not_cool@dude.com');
    component.submit();
    fixture.detectChanges();
    const error = document.getElementsByTagName('mat-error')[0];
    expect(error.textContent).toBe(component.errorText);
  });

  it("shouldn't be able to resend the email right after sending it", () => {
    component.emailControl.setValue('cool@dude.com');
    component.submit();
    fixture.detectChanges();
    const button = document.getElementsByTagName('button')[0];
    expect(button.disabled).toBeTruthy();
  });

  it('should be able to resend email after 60 seconds', fakeAsync(() => {
    component.emailControl.setValue('cool@dude.com');
    component.submit();
    fixture.detectChanges();
    tick(60000);
    discardPeriodicTasks();
    fixture.detectChanges();
    const button = document.getElementsByTagName('button')[0];
    expect(button.disabled).toBeFalsy();
  }));
});
