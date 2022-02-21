import { Component, ViewEncapsulation } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialogRef } from '@angular/material/dialog';
import { isMobileDevice } from '@shared/helpers/others/is-mobile-device';
import { AuthService } from '@shared/services/auth/auth.service';
import { ThemeService } from '@shared/services/theme/theme.service';
import { ThemeSheetComponent } from '../theme-sheet/theme-sheet.component';

@Component({
  selector: 'app-more-dialog',
  templateUrl: './more-dialog.component.html',
  styleUrls: ['./more-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MoreDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<MoreDialogComponent>,
    private auth: AuthService,
    private bottomSheet: MatBottomSheet
  ) {
    window.setTimeout(() => {
      const isMobile = isMobileDevice();
      this.dialogRef.updateSize(isMobile ? '400px' : '250px');
      this.dialogRef.updatePosition({
        top: '2rem',
        right: isMobile ? undefined : '2rem',
      });
    });
  }

  public changeTheme(): void {
    this.bottomSheet.open(ThemeSheetComponent);
  }

  public logout(): void {
    this.dialogRef.close();
    this.auth.logout().subscribe();
  }
}
