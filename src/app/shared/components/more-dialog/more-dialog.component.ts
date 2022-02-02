import { Component, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { isMobileDevice } from '@shared/helpers/others/is-mobile-device';
import { AuthService } from '@shared/services/auth/auth.service';

@Component({
  selector: 'app-more-dialog',
  templateUrl: './more-dialog.component.html',
  styleUrls: ['./more-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MoreDialogComponent {

  constructor(public dialogRef: MatDialogRef<MoreDialogComponent>, private auth: AuthService) {
    window.setTimeout(() => {
      const isMobile = isMobileDevice();
      this.dialogRef.updateSize(isMobile ? '400px' : '200px');
      this.dialogRef.updatePosition({top: '2rem', right: isMobile? undefined : '2rem'});
    });
  }

  public isDarkTheme() : boolean {
    return !document.body.classList.contains('app-light-theme');
  }

  public toggleTheme() : void {
    // TODO: use theme service
    document.body.classList.toggle('app-light-theme');
  }

  public logout() : void {
    this.dialogRef.close();
    this.auth.logout().subscribe();
  }
}
