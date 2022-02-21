import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';
import { MatListModule } from '@angular/material/list';

import { ThemeSheetComponent } from './theme-sheet.component';

describe('ThemeSheetComponent', () => {
  let component: ThemeSheetComponent;
  let fixture: ComponentFixture<ThemeSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatListModule],
      declarations: [ThemeSheetComponent],
      providers: [
        { provide: MatBottomSheetRef, useValue: {} },
        { provide: MAT_BOTTOM_SHEET_DATA, useValue: [] },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemeSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call changeTheme for light theme', () => {
    const functionMock = spyOn<any>(component, 'changeTheme');
    const container = document.getElementsByClassName('mat-nav-list')[0];
    const link = container.getElementsByTagName('a')[0] as HTMLElement;
    link.click();
    expect(functionMock).toHaveBeenCalledWith('light');
  });

  it('should call changeTheme for dark theme', () => {
    const functionMock = spyOn<any>(component, 'changeTheme');
    const container = document.getElementsByClassName('mat-nav-list')[0];
    const link = container.getElementsByTagName('a')[1] as HTMLElement;
    link.click();
    expect(functionMock).toHaveBeenCalledWith('dark');
  });

  it('should call changeTheme for system theme', () => {
    const functionMock = spyOn<any>(component, 'changeTheme');
    const container = document.getElementsByClassName('mat-nav-list')[0];
    const link = container.getElementsByTagName('a')[2] as HTMLElement;
    link.click();
    expect(functionMock).toHaveBeenCalledWith('system');
  });
});
