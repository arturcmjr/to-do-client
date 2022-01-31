import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ToDosComponent } from './to-dos.component';

describe('ToDosComponent', () => {
  let component: ToDosComponent;
  let fixture: ComponentFixture<ToDosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, MatDialogModule],
      declarations: [ToDosComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToDosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call openDialog', () => {
    // const fixture = TestBed.createComponent(ToDosComponent);
    const app = fixture.componentInstance;
    const expected_header = "ToDo";
    app.openDialog();
    fixture.detectChanges();
    const popUpHeader = document.getElementsByTagName('h1')[0] as HTMLHeadElement;
    expect(popUpHeader.innerText).toEqual(expected_header);
  });
});
