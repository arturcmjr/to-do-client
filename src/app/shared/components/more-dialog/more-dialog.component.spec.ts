import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatBottomSheetModule, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';

import { MoreDialogComponent } from './more-dialog.component';

describe('MoreDialogComponent', () => {
  let component: MoreDialogComponent;
  let fixture: ComponentFixture<MoreDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule, RouterTestingModule, MatBottomSheetModule],
      declarations: [MoreDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: [] },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoreDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call changeTheme', () => {
    const functionMock = spyOn<any>(component, 'changeTheme');
    const button = document.getElementsByTagName('button')[1] as HTMLElement;
    button.click();
    expect(functionMock).toHaveBeenCalled();
  });

  it('should call logout on auth service', () => {
    const functionMock = spyOn<any>(component, 'logout');
    const button = document.getElementsByTagName('button')[0] as HTMLElement;
    button.click();
    expect(functionMock).toHaveBeenCalled();
  });
});
