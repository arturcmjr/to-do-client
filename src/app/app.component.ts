import { Component, OnInit } from '@angular/core';
import { ThemeService } from '@shared/services/theme/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'to-do-client';

  constructor(private theme: ThemeService) {}

  public ngOnInit(): void {
    // // TODO: create a service to handle theming
    // const settingsFound = !!localStorage.getItem('useDarkTheme');
    // let isDarkTheme = false;
    // if(settingsFound) {
    //   isDarkTheme = JSON.parse(
    //     localStorage.getItem('useDarkTheme') ?? 'false'
    //   );
    // } else {
    //   isDarkTheme = window.matchMedia('(prefers-color-scheme: dark)')?.matches;
    // }
    // document.body.classList.toggle('app-light-theme', !isDarkTheme);
  }
}
