import { Component, OnInit } from '@angular/core';
import { ThemeService } from '@shared/services/theme/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  // injecting ThemeService here to be sure the whole app have the theme initiated
  constructor(private theme: ThemeService) {}
  
}
