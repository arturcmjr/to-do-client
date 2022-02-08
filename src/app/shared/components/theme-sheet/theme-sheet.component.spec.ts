import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeSheetComponent } from './theme-sheet.component';

describe('ThemeSheetComponent', () => {
  let component: ThemeSheetComponent;
  let fixture: ComponentFixture<ThemeSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemeSheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemeSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
