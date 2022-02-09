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
import { MatDialog } from '@angular/material/dialog';
import { MatSpinner } from '@angular/material/progress-spinner';

@Directive({
  selector: '[app-spinner-button]',
})
export class SpinnerButtonDirective implements OnInit {
  private buttonElement: HTMLElement;

  @Input() set isLoading(value: boolean) {
    this.buttonElement.classList.toggle('spinner-show',value);
    this.buttonElement.classList.toggle('spinner-hide',!value);
  }
  
  constructor(
    private el: ElementRef,
    private viewContainer: ViewContainerRef,
    private renderer: Renderer2
  ) {
    this.buttonElement = el.nativeElement;
    this.isLoading = false;
  }

  ngOnInit(): void {
    window.setTimeout(() => {
      const buttonWrapper = this.el.nativeElement.firstChild as HTMLElement;
      const child = buttonWrapper.firstChild as HTMLElement;
      const overlay = this.renderer.createElement('div') as HTMLElement;
      overlay.classList.add('spinner-overlay');
      const spinner = this.viewContainer.createComponent(MatSpinner);
      spinner.instance.diameter = 17;
      this.renderer.appendChild(buttonWrapper,spinner.location.nativeElement);
      this.renderer.appendChild(buttonWrapper,child);
      this.renderer.appendChild(buttonWrapper,overlay);
    });
  }
}
