import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmPasswordRecoveryComponent } from './confirm-password-recovery.component';

describe('ConfirmPasswordRecoveryComponent', () => {
  let component: ConfirmPasswordRecoveryComponent;
  let fixture: ComponentFixture<ConfirmPasswordRecoveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmPasswordRecoveryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmPasswordRecoveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
