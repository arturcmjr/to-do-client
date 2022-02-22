import { TestBed } from '@angular/core/testing';

import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;
  const storageKey = 'user_theme';

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
    localStorage.removeItem(storageKey);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get theme', () => {
    localStorage.setItem(storageKey,'light')
    expect(service.getTheme()).toBe('light');
  });

  it('should set theme', () => {
    service.setTheme('dark');
    expect(localStorage.getItem(storageKey)).toBe('dark');
  });

  it('should toggle light theme class', () => {
    service.setTheme('light');
    let body = document.body;
    expect(body.classList).toContain('app-light-theme');
  });

  it('should toggle light theme class', () => {
    service.setTheme('dark');
    let body = document.body;
    expect(body.classList).not.toContain('app-light-theme');
  });
});
