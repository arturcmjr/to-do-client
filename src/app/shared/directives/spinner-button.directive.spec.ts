import {
  Renderer2,
  ViewContainerRef,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { MatButton } from '@angular/material/button';
import { SpinnerButtonDirective } from './spinner-button.directive';

describe('SpinnerButtonDirective', () => {
  let component: MatButton;
  let fixture: ComponentFixture<MatButton>;

  let viewContainerRef: ViewContainerRef;
  let renderer2: Renderer2;
  let directive: SpinnerButtonDirective;

  beforeEach(() => {
    const viewContainerRefSpy = jasmine.createSpyObj(
      'ViewContainerRef',
      ['insert'],
      { injector: TestBed }
    );
    const renderer2Spy = jasmine.createSpyObj('Renderer2', ['insert'], {
      injector: TestBed,
    });

    TestBed.configureTestingModule({
      declarations: [MatButton, SpinnerButtonDirective],
      providers: [
        { provide: ViewContainerRef, useValue: viewContainerRefSpy },
        { provide: Renderer2, useValue: renderer2Spy },
      ],
    });

    fixture = TestBed.createComponent(MatButton);
    component = fixture.componentInstance;
    viewContainerRef = TestBed.inject(ViewContainerRef);
    renderer2 = TestBed.inject(Renderer2);
    directive = new SpinnerButtonDirective(
      fixture.elementRef,
      viewContainerRef,
      renderer2
    );
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should be hidden at the start', () => {
    const hiddenClass = document.getElementsByClassName('spinner-hide')[0];
    expect(hiddenClass).toBeTruthy();
  });

  it('should show when loading', () => {
    directive.isLoading = true;
    fixture.detectChanges();
    const showClass = document.getElementsByClassName('spinner-show')[0];
    expect(showClass).toBeTruthy();
  });
});
