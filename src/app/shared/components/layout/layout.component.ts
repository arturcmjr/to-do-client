import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MoreDialogComponent } from '../more-dialog/more-dialog.component';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  toggleTheme(): void {
    document.body.classList.toggle('app-light-theme');
  }

  public openMoreDialog() : void {
    const dialogRef = this.dialog.open(MoreDialogComponent);
    // dialogRef.
  }
}
