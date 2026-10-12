import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [ThemeService]
    });
    service = TestBed.inject(ThemeService);
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('should be created and default to dark mode per specification', () => {
    expect(service).toBeTruthy();
    expect(service.currentTheme()).toBe('dark');
    expect(service.isDark()).toBeTrue();
  });

  it('should toggle theme between dark and light', () => {
    expect(service.currentTheme()).toBe('dark');
    service.toggleTheme();
    expect(service.currentTheme()).toBe('light');
    expect(service.isDark()).toBeFalse();
    expect(localStorage.getItem('sistema_theme')).toBe('light');

    service.toggleTheme();
    expect(service.currentTheme()).toBe('dark');
    expect(service.isDark()).toBeTrue();
    expect(localStorage.getItem('sistema_theme')).toBe('dark');
  });

  it('should explicitly set theme', () => {
    service.setTheme('light');
    expect(service.currentTheme()).toBe('light');
    expect(localStorage.getItem('sistema_theme')).toBe('light');

    service.setTheme('dark');
    expect(service.currentTheme()).toBe('dark');
    expect(localStorage.getItem('sistema_theme')).toBe('dark');
  });
});
