import {
  Directive,
  ElementRef,
  HostBinding,
  Input,
  OnInit,
  Renderer2,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { MatSpinner } from '@angular/material/progress-spinner';

@Directive({
  selector: '[app-spinner-button]',
})
export class SpinnerButtonDirective implements OnInit {
  private buttonElement: HTMLElement;

  // private isLoading: boolean = false;

  @Input() set isLoading(value: boolean) {
    this.buttonElement.classList.toggle('spinner-show',value);
    this.buttonElement.classList.toggle('spinner-hide',!value);
    console.log(value);
    /* button.spinner-show,
button.spinner-hide */
  }
  
  constructor(
    private el: ElementRef,
    private viewContainer: ViewContainerRef,
    private renderer: Renderer2
  ) {
    this.buttonElement = el.nativeElement;
    this.buttonElement.classList.add('spinner-hide');
  }

  ngOnInit(): void {
    window.setTimeout(() => {
      const buttonWrapper = this.el.nativeElement.firstChild as HTMLElement;
      const child = buttonWrapper.firstChild as HTMLElement;
      console.log(buttonWrapper.firstChild);
      const overlay = this.renderer.createElement('div') as HTMLElement;
      overlay.classList.add('spinner-overlay');
      const spinner = this.viewContainer.createComponent(MatSpinner);
      spinner.instance.diameter = 17;
      this.renderer.appendChild(buttonWrapper,spinner.location.nativeElement);
      this.renderer.appendChild(buttonWrapper,child);
      this.renderer.appendChild(buttonWrapper,overlay);
    });
    /* 
    // console.log(this.viewContainer);
    const spinner = this.viewContainer.createComponent(MatSpinner);
    console.log(spinner.instance);
    spinner.instance.diameter = 17;
    // this.renderer.setProperty(this.viewContainer.element, 'innerHTML', '<div>testó</div>');
    window.setTimeout(() => {
      this.renderer.appendChild(this.el.nativeElement,spinner.location.nativeElement);
      const e = spinner.location.nativeElement as HTMLElement;
      // e.classList
      // const el = this.el.nativeElement.children.item(0) as HTMLElement;
      // console.log(el.style);
      // // this.renderer.appendChild(el,spinner.instance);
      // this.renderer.setProperty(el,'innerHTML',`<mat-spinner [diameter]="17" [strokeWidth]="2"></mat-spinner>MALAKA`);
      // const div = this.renderer.createElement('div');
      // const text = this.renderer.createText('Hello world!');
      // const elo = this.el.nativeElement as HTMLElement;

      // // this.renderer.appendChild(div, text);
      // this.renderer.setProperty(div,'my-test',`<mat-spinner [diameter]="17" [strokeWidth]="2"></mat-spinner>MALAKA`);
      // this.renderer.appendChild(this.el.nativeElement, div);
      // this.renderer.setProperty(
      //   this.el.nativeElement,
      //   'innerHTML',
      //   `<mat-spinner [diameter]="17" [strokeWidth]="2"></mat-spinner>MALAKA`
      // );
    }); */
  }
}
