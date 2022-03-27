import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
import { DialogMessageErrorComponent } from '../dialogs/dialog-message-error/dialog-message-error.component';
import { DialogQuestionComponent } from '../dialogs/dialog-question/dialog-question.component';

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
      });
  }

  deleteMessageQuestion(messageQuestion: string): Observable<any> {
    return this.dialog
      .open(DialogQuestionComponent, {
        data: { message: messageQuestion },
        //width: "600px",
      })
      .afterClosed()
  }
}
