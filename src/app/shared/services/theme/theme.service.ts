import { Injectable } from '@angular/core';

const STORAGE_KEY = 'user_theme';

export type Theme = "light" | "dark" | "system";

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  
  constructor() {
    this.init();
  }

  private init(): void {
    const theme = this.getTheme();
    this.setTheme(theme);
  }

  public getTheme(): Theme {
    return localStorage.getItem(STORAGE_KEY) as Theme || 'system';
  }

  public setTheme(theme: Theme): void {
    localStorage.setItem(STORAGE_KEY, theme);
    let isDark = theme === 'dark';
    if(theme === 'system') {
      isDark = window.matchMedia('(prefers-color-scheme: dark)')?.matches;
    }
    document.body.classList.toggle('app-light-theme', !isDark);
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if(themeMeta) {
      themeMeta.setAttribute('content', isDark ? '#1f1f1f' :'#8bc34a');
    }
  }
}
