import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Magazzino, TypeProcedureMagazzino } from 'src/app/models/magazzino';
import { MagazzinoService } from 'src/app/service/magazzino.service';
import { MessagesService } from 'src/app/service/messages.service';
import { UsersService } from '../../service/users.service';
import { AuthenticationService } from '../../service/authentication.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-dialog-carico-magazzino',
  templateUrl: './dialog-carico-magazzino.component.html',
  styleUrls: ['./dialog-carico-magazzino.component.css']
})
export class DialogCaricoMagazzinoComponent implements OnInit {
  quantita: number;
  user: User;
  constructor(
    private messageService: MessagesService,
    private magazzinoService: MagazzinoService,
    private userService: UsersService,
    private authenticationService: AuthenticationService,
    public dialogRef: MatDialogRef<DialogCaricoMagazzinoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      magazzino: Magazzino,
      type: TypeProcedureMagazzino
    }
  ) { }

  ngOnInit(): void {
    this.user = new User();
    this.quantita = 0;
    this.authenticationService.getCurrentUserAsync().subscribe(
      (user) => {
        this.user = user;
      });
  }

  check() {
    if (this.quantita > this.data.magazzino.quantita &&
        this.data.type === TypeProcedureMagazzino.Scarico)
    {
      throw new Error("Quantita non valida");
    }
  }

  save() {

    try {

      this.check();



      if (this.data.type === TypeProcedureMagazzino.Carico) {
        this.data.magazzino.quantita+=this.quantita;
      }

      if (this.data.type === TypeProcedureMagazzino.Scarico) {
        this.data.magazzino.quantita-=this.quantita;
      }
      this.data.magazzino.quantita < 0 ?
        this.data.magazzino.quantita = 0 :
        this.data.magazzino.quantita =
        this.data.magazzino.quantita;
      this.data.magazzino.idUser = this.user._id;
      this.magazzinoService.carico_scarico(this.data.magazzino, this.data.type)
          .subscribe(
            result=> {
              console.log("Aggiornamento magazzino eseguito", result);
              this.dialogRef.close(this.data.magazzino);
            },
            err=> {
              console.error("Errore aggiornamento magazzino", err);
              this.messageService.showMessageError("Errore Carico o Scarico dal magazzino");
            });
    } catch (err) {
      console.error("Errore aggiornamento magazzino", err);
      this.messageService.showMessageError("Errore Carico o Scarico dal magazzino");

    }
  }

  cancel() {
    this.dialogRef.close(undefined);
  }

}
