import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DialogMessageErrorComponent } from '../dialogs/dialog-message-error/dialog-message-error.component';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(
    public dialog: MatDialog,
  ) { }

  showMessageError(messageError: string) {
    var dialogRef = this.dialog.open(DialogMessageErrorComponent, {
      panelClass: "custom-modalbox",
      data: messageError,
    });

    if (dialogRef != undefined)
      dialogRef.afterClosed().subscribe((result) => {
        console.log("The dialog was closed", result);
      });
  }
}
