import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Magazzino } from 'src/app/models/magazzino';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { MagazzinoService } from 'src/app/service/magazzino.service';
import { MessagesService } from 'src/app/service/messages.service';

@Component({
  selector: 'app-dialog-magazzino',
  templateUrl: './dialog-magazzino.component.html',
  styleUrls: ['./dialog-magazzino.component.css']
})
export class DialogMagazzinoComponent implements OnInit {

  magazzino: Magazzino;

  constructor(
    private authenticationService: AuthenticationService,
    private magazzinoService: MagazzinoService,
    public messageService: MessagesService,
    public dialogRef: MatDialogRef<DialogMagazzinoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      magazzino: Magazzino,
      isNew: boolean
    }
  ) {

    console.log("Magazzino Dialog", data);

    if (data.isNew) {

      this.authenticationService.getCurrentUserAsync()
          .subscribe(
            (user)=>{
              this.magazzino = {
                area: "",
                conformi: "",
                dateInsert: new Date(),
                descrizione: "",
                giacenza: "",
                inuso: false,
                nome: "",
                quantita: 0,
                idUser: user._id
              };
            })
    } else {
      this.magazzino = data.magazzino;
    }
  }

  ngOnInit(): void {
  }

  save() {
    if (this.data.isNew) {
      this.magazzinoService.add(this.magazzino)
          .subscribe(result=>{
            this.dialogRef.close(this.magazzino);
          },
          err=> {
            this.messageService.showMessageError("Errore inserimento nuovo materiale o presidio");
          });
    } else {
      this.magazzinoService.update(this.magazzino)
          .subscribe(result=>{
            this.dialogRef.close(this.magazzino);
          },
          err=> {
            this.messageService.showMessageError("Errore modifica del materiale o presidio");
          })
    }
  }

  cancel() {
    this.dialogRef.close(undefined);
  }
}
