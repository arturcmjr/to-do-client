import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Theme, ThemeService } from '@shared/services/theme/theme.service';

@Component({
  selector: 'app-theme-sheet',
  templateUrl: './theme-sheet.component.html',
  styleUrls: ['./theme-sheet.component.scss'],
})
export class ThemeSheetComponent {
  constructor(
    private bottomSheetRef: MatBottomSheetRef<ThemeSheetComponent>,
    private themeService: ThemeService
  ) {}

  public changeTheme(theme: Theme): void {
    this.themeService.setTheme(theme);
    this.bottomSheetRef.dismiss();
  }
}
