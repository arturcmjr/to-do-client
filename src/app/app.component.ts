import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'to-do-client';

  public ngOnInit(): void {
    // TODO: create a service to handle theming
    const settingsFound = !!localStorage.getItem('useDarkTheme');
    let isDarkTheme = false;
    if(settingsFound) {
      isDarkTheme = JSON.parse(
        localStorage.getItem('useDarkTheme') ?? 'false'
      );
    } else {
      isDarkTheme = window.matchMedia('(prefers-color-scheme: dark)')?.matches;
    }
    document.body.classList.toggle('app-light-theme', !isDarkTheme);
  }
}
