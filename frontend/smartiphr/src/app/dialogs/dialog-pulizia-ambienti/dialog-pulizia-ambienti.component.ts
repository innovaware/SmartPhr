import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: 'app-dialog-pulizia-ambienti',
  templateUrl: './dialog-pulizia-ambienti.component.html',
  styleUrls: ['./dialog-pulizia-ambienti.component.css']
})
export class DialogPuliziaAmbientiComponent implements OnInit {

  note: string;
  date: Date;
  user: User;

  constructor(
    private authenticationService: AuthenticationService,
    public dialogRef: MatDialogRef<DialogPuliziaAmbientiComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      note: string;
      date: Date;
      user: User;
    }) {
      this.authenticationService.getCurrentUserAsync().subscribe((user: User) => {
        this.user = user;
        console.log("Dialog Pulizia Ambienti Enabled");
      });
    }

  ngOnInit(): void {
    this.date = new Date();
  }

  cancel() {
    this.dialogRef.close(undefined);
  }

  save() {
      const item = {
        note: this.note,
        date: this.date,
        user: this.user
      };
      console.log("Dialog Pulizia Ambienti Save item", item);
      this.dialogRef.close(item);
  }

}
